import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Verify webhook signature
    const signature = request.headers.get("x-webhook-signature");
    const timestamp = request.headers.get("x-webhook-timestamp");

    // TODO: Implement signature verification
    // https://docs.cashfree.com/docs/webhooks

    const { type, data } = body;

    if (type === "PAYMENT_SUCCESS_WEBHOOK") {
      const { order, payment } = data;
      const orderId = order.order_id;
      const orderAmount = order.order_amount;
      const customerEmail = order.customer_details.customer_email;
      const paymentId = payment?.cf_payment_id || null;
      const paymentMethod = payment?.payment_method || null;

      const supabase = await createClient();

      // Save payment to database
      const { data: paymentData, error: paymentError } = await supabase
        .from("payments")
        .insert({
          email: customerEmail,
          order_id: orderId,
          payment_id: paymentId,
          amount: orderAmount,
          currency: "INR",
          status: "success",
          payment_method: paymentMethod,
        })
        .select()
        .single();

      if (paymentError) {
        console.error("Error saving payment:", paymentError);
        return NextResponse.json(
          { error: "Failed to save payment" },
          { status: 500 }
        );
      }

      // Update or create user subscription
      const { error: subscriptionError } = await supabase
        .from("user_subscriptions")
        .upsert(
          {
            email: customerEmail,
            is_paid: true,
            payment_id: paymentData.id,
            access_granted_at: new Date().toISOString(),
          },
          {
            onConflict: "email",
          }
        );

      if (subscriptionError) {
        console.error("Error updating subscription:", subscriptionError);
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
