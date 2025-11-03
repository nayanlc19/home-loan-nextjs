import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { Cashfree } = await import("cashfree-pg");

    // Initialize Cashfree
    // @ts-ignore - Cashfree SDK types may not be fully accurate
    Cashfree.XClientId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID!;
    // @ts-ignore
    Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY!;
    // @ts-ignore
    Cashfree.XEnvironment =
      process.env.CASHFREE_MODE === "production"
        // @ts-ignore
        ? Cashfree.Environment.PRODUCTION
        // @ts-ignore
        : Cashfree.Environment.SANDBOX;

    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const request_body = {
      order_id: orderId,
      order_amount: parseFloat(process.env.PAYMENT_AMOUNT || "99"),
      order_currency: "INR",
      customer_details: {
        customer_id: session.user.id,
        customer_email: session.user.email,
        customer_name: session.user.name || "User",
        customer_phone: "9999999999", // Optional: collect from user
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback?order_id={order_id}`,
        notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook`,
      },
    };

    // @ts-ignore
    const response = await Cashfree.PGCreateOrder("2023-08-01", request_body);

    return NextResponse.json({
      orderId: orderId,
      paymentSessionId: response.data.payment_session_id,
      orderToken: response.data.order_token,
    });
  } catch (error: any) {
    console.error("Payment order creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}
