import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    // Get raw body for signature verification
    const bodyText = await request.text();
    const body = JSON.parse(bodyText);

    // CRITICAL SECURITY: Verify webhook signature
    const signature = request.headers.get("x-webhook-signature");
    const timestamp = request.headers.get("x-webhook-timestamp");
    const webhookSecret = process.env.CASHFREE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("CASHFREE_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (!signature || !timestamp) {
      console.error("Missing webhook signature or timestamp");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify signature
    const payload = timestamp + bodyText;
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(payload)
      .digest("base64");

    if (signature !== expectedSignature) {
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Timestamp verification - reject old webhooks (replay protection)
    const webhookTime = parseInt(timestamp);
    const currentTime = Math.floor(Date.now() / 1000);
    const timeDiff = currentTime - webhookTime;

    if (timeDiff > 300) { // 5 minutes
      console.error("Webhook timestamp too old:", timeDiff, "seconds");
      return NextResponse.json(
        { error: "Webhook expired" },
        { status: 401 }
      );
    }

    console.log("Cashfree webhook received (verified):", body);

    // Extract event type and data
    const { type, data } = body;

    // Handle payment success event
    if (type === "PAYMENT_SUCCESS_WEBHOOK") {
      const { order } = data;
      const orderId = order?.order_id;
      const orderAmount = parseFloat(order?.order_amount || "0");
      const paymentId = order?.cf_order_id || orderId;

      if (!orderId) {
        console.error("Order ID not found in webhook data");
        return NextResponse.json(
          { error: "Invalid webhook data" },
          { status: 400 }
        );
      }

      // Validate payment amount
      const expectedAmount = parseFloat(process.env.PAYMENT_AMOUNT || "99");
      if (Math.abs(orderAmount - expectedAmount) > 0.01) {
        console.error(`Invalid payment amount: ${orderAmount}, expected: ${expectedAmount}`);
        return NextResponse.json(
          { error: "Invalid payment amount" },
          { status: 400 }
        );
      }

      // Verify payment status with Cashfree API
      const cashfreeUrl =
        process.env.CASHFREE_ENV === "production"
          ? `https://api.cashfree.com/pg/orders/${orderId}`
          : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

      const cashfreeResponse = await fetch(cashfreeUrl, {
        method: "GET",
        headers: {
          "x-client-id": process.env.CASHFREE_CLIENT_ID!,
          "x-client-secret": process.env.CASHFREE_CLIENT_SECRET!,
          "x-api-version": "2023-08-01",
          "Content-Type": "application/json",
        },
      });

      if (!cashfreeResponse.ok) {
        console.error("Failed to verify payment with Cashfree");
        return NextResponse.json(
          { error: "Payment verification failed" },
          { status: 500 }
        );
      }

      const paymentData = await cashfreeResponse.json();

      if (paymentData.order_status === "PAID") {
        // Get user email from order metadata or customer details
        const userEmail =
          order?.customer_details?.customer_email ||
          paymentData.customer_details?.customer_email;

        if (!userEmail) {
          console.error("User email not found in payment data");
          return NextResponse.json(
            { error: "Invalid payment data" },
            { status: 400 }
          );
        }

        const supabase = await createClient();

        // Check for idempotency - prevent duplicate processing
        const { data: existingPayment } = await supabase
          .from("payments")
          .select("order_id")
          .eq("order_id", orderId)
          .single();

        if (existingPayment) {
          console.log(`Payment ${orderId} already processed - idempotent response`);
          return NextResponse.json({
            success: true,
            message: "Payment already processed",
          });
        }

        // Start transaction-like operations
        const now = new Date().toISOString();

        // Insert payment record first (idempotency check)
        const { error: paymentError } = await supabase
          .from("payments")
          .insert({
            email: userEmail,
            order_id: orderId,
            payment_id: paymentId,
            amount: orderAmount,
            status: "completed",
            created_at: now,
          });

        if (paymentError) {
          console.error("Failed to insert payment record:", paymentError);
          // Don't expose internal error details
          return NextResponse.json(
            { error: "Database error" },
            { status: 500 }
          );
        }

        // Update subscription status (using correct schema)
        const { error: subscriptionError } = await supabase
          .from("user_subscriptions")
          .upsert(
            {
              email: userEmail,
              is_paid: true,
              access_granted_at: now,
            },
            {
              onConflict: "email",
            }
          );

        if (subscriptionError) {
          console.error("Failed to update subscription:", subscriptionError);
          // Try to rollback payment record
          await supabase
            .from("payments")
            .delete()
            .eq("order_id", orderId);

          return NextResponse.json(
            { error: "Database error" },
            { status: 500 }
          );
        }

        console.log(`Subscription activated for user: ${userEmail}, order: ${orderId}`);

        return NextResponse.json({
          success: true,
          message: "Subscription activated",
        });
      } else {
        console.log(`Payment not completed: ${paymentData.order_status}`);
        return NextResponse.json({
          success: true,
          message: "Payment not completed",
        });
      }
    }

    // For other webhook events, just acknowledge receipt
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    // Don't expose internal error details to client
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
