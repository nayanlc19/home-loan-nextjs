import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("Cashfree webhook received:", body);

    // Extract event type and data
    const { type, data } = body;

    // Handle payment success event
    if (type === "PAYMENT_SUCCESS_WEBHOOK") {
      const { order } = data;
      const orderId = order?.order_id;
      const orderAmount = order?.order_amount;
      const paymentId = order?.cf_order_id || orderId;

      // Note: In production, you should verify the webhook signature
      // to ensure it's coming from Cashfree

      if (!orderId) {
        console.error("Order ID not found in webhook data");
        return NextResponse.json(
          { error: "Order ID missing" },
          { status: 400 }
        );
      }

      // Verify payment status with Cashfree API
      const cashfreeUrl =
        process.env.CASHFREE_MODE === "production"
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
        throw new Error("Failed to verify payment with Cashfree");
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
            { error: "User email missing" },
            { status: 400 }
          );
        }

        // Update Supabase database
        const supabase = await createClient();

        const subscriptionData = {
          user_email: userEmail,
          subscription_status: "active",
          subscribed_at: new Date().toISOString(),
          expires_at: new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000
          ).toISOString(), // 1 year from now
          payment_id: paymentId,
          amount_paid: orderAmount || 99,
        };

        const { error: upsertError } = await supabase
          .from("user_subscriptions")
          .upsert(subscriptionData, {
            onConflict: "user_email",
          });

        if (upsertError) {
          console.error("Database error:", upsertError);
          throw new Error("Failed to update subscription in database");
        }

        console.log(`Subscription activated for user: ${userEmail}`);

        return NextResponse.json({
          success: true,
          message: "Subscription activated",
        });
      }
    }

    // For other webhook events, just acknowledge receipt
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}
