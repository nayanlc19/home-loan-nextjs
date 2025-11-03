import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

    const { Cashfree } = await import("cashfree-pg");

    // Initialize Cashfree
    // @ts-ignore - Cashfree SDK types may not be fully accurate
    Cashfree.XClientId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID!;
    // @ts-ignore
    Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY!;
    // @ts-ignore
    Cashfree.XEnvironment =
      process.env.CASHFREE_MODE === "production"
        ? Cashfree.Environment.PRODUCTION
        : Cashfree.Environment.SANDBOX;

    const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);

    if (response.data && response.data.length > 0) {
      const payment = response.data[0];

      if (payment.payment_status === "SUCCESS") {
        // TODO: Save to database that user has paid
        // Update user's isPaid status

        return NextResponse.json({
          success: true,
          payment: {
            orderId: orderId,
            amount: payment.payment_amount,
            status: payment.payment_status,
          },
        });
      }
    }

    return NextResponse.json({
      success: false,
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
