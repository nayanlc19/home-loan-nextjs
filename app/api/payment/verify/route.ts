import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, getClientIp, RateLimitPresets } from "@/lib/rate-limiter";

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    const rateLimitResult = rateLimit(clientIp, RateLimitPresets.PAYMENT_VERIFY);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests" },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": new Date(rateLimitResult.resetTime).toISOString(),
          },
        }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Check for idempotency - prevent duplicate processing
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("email, order_id, amount, status")
      .eq("order_id", orderId)
      .single();

    if (existingPayment) {
      // Verify ownership
      if (existingPayment.email !== session.user.email) {
        console.warn(`User ${session.user.email} attempted to verify order ${orderId} owned by ${existingPayment.email}`);
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        );
      }

      // Payment already processed
      console.log(`Payment ${orderId} already processed - idempotent response`);
      return NextResponse.json({
        success: true,
        payment_status: "SUCCESS",
        payment: {
          orderId: existingPayment.order_id,
          amount: existingPayment.amount,
          status: existingPayment.status,
        },
      });
    }

    // Verify payment with Cashfree API
    const cashfreeUrl = process.env.CASHFREE_ENV === "production"
      ? `https://api.cashfree.com/pg/orders/${orderId}`
      : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

    const cashfreeResponse = await fetch(cashfreeUrl, {
      method: "GET",
      headers: {
        "x-client-id": process.env.CASHFREE_CLIENT_ID!,
        "x-client-secret": process.env.CASHFREE_CLIENT_SECRET!,
        "x-api-version": "2025-01-01",
        "Content-Type": "application/json",
      },
    });

    if (!cashfreeResponse.ok) {
      console.error("Cashfree API error:", cashfreeResponse.status);
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 500 }
      );
    }

    const paymentData = await cashfreeResponse.json();

    // Verify ownership - ensure the payment belongs to the logged-in user
    if (paymentData.customer_details?.customer_email !== session.user.email) {
      console.warn(`User ${session.user.email} attempted to verify order ${orderId} belonging to ${paymentData.customer_details?.customer_email}`);
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    if (paymentData.order_status === "PAID") {
      // Validate payment amount
      const expectedAmount = parseFloat(process.env.PAYMENT_AMOUNT || "99");
      const actualAmount = parseFloat(paymentData.order_amount || "0");

      if (Math.abs(actualAmount - expectedAmount) > 0.01) {
        console.error(`Invalid payment amount: ${actualAmount}, expected: ${expectedAmount}`);
        return NextResponse.json(
          { error: "Invalid payment amount" },
          { status: 400 }
        );
      }

      // Transaction-like operations
      const now = new Date().toISOString();

      // Insert payment record first (for idempotency)
      const { error: paymentError } = await supabase
        .from("payments")
        .insert({
          order_id: orderId,
          email: session.user.email,
          payment_id: paymentData.cf_order_id || orderId,
          amount: actualAmount,
          status: "completed",
          created_at: now,
        });

      if (paymentError) {
        console.error("Payment table error:", paymentError);
        return NextResponse.json(
          { error: "Database error" },
          { status: 500 }
        );
      }

      // Update subscription status
      const { error: subscriptionError } = await supabase
        .from("user_subscriptions")
        .upsert({
          email: session.user.email,
          is_paid: true,
          access_granted_at: now,
        }, {
          onConflict: "email",
        });

      if (subscriptionError) {
        console.error("Subscription table error:", subscriptionError);

        // Rollback payment record
        await supabase
          .from("payments")
          .delete()
          .eq("order_id", orderId);

        return NextResponse.json(
          { error: "Database error" },
          { status: 500 }
        );
      }

      console.log(`Payment verified and subscription activated for ${session.user.email}, order: ${orderId}`);

      return NextResponse.json({
        success: true,
        payment_status: "SUCCESS",
        payment: {
          orderId: orderId,
          amount: actualAmount,
          status: paymentData.order_status,
        },
      });
    }

    return NextResponse.json({
      success: false,
      status: paymentData.order_status?.toLowerCase() || "unknown",
      message: "Payment not completed",
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    // Don't expose internal error details
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
