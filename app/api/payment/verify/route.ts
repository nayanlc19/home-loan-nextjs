import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    // Verify payment with Cashfree API
    const cashfreeUrl = process.env.CASHFREE_MODE === "production"
      ? `https://api.cashfree.com/pg/orders/${orderId}`
      : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

    const cashfreeResponse = await fetch(cashfreeUrl, {
      method: "GET",
      headers: {
        "x-client-id": process.env.NEXT_PUBLIC_CASHFREE_APP_ID!,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json",
      },
    });

    if (!cashfreeResponse.ok) {
      throw new Error("Failed to fetch payment status from Cashfree");
    }

    const paymentData = await cashfreeResponse.json();

    if (paymentData.order_status === "PAID") {
      // Save to Supabase database
      const supabase = await createClient();

      // Save to payments table
      const paymentRecord = {
        order_id: orderId,
        email: session.user.email,
        amount: paymentData.order_amount || 99,
        status: "success",
      };

      const { error: paymentError } = await supabase
        .from("payments")
        .insert(paymentRecord);

      if (paymentError) {
        console.error("Payment table error:", paymentError);
        throw new Error("Failed to save payment to database");
      }

      // Update user_subscriptions table
      const { error: subscriptionError } = await supabase
        .from("user_subscriptions")
        .upsert({
          email: session.user.email,
          is_paid: true,
          access_granted_at: new Date().toISOString(),
        }, {
          onConflict: "email",
        });

      if (subscriptionError) {
        console.error("Subscription table error:", subscriptionError);
        throw new Error("Failed to update subscription status");
      }

      return NextResponse.json({
        success: true,
        status: "paid",
        payment: {
          orderId: orderId,
          amount: paymentData.order_amount || 99,
          status: paymentData.order_status,
        },
      });
    }

    return NextResponse.json({
      success: false,
      status: "failed",
      message: "Payment not successful",
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}
