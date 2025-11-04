import { NextRequest, NextResponse } from "next/server";
import { checkUserSubscription } from "@/lib/check-subscription";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  try {
    const hasAccess = await checkUserSubscription(email);
    return NextResponse.json({ hasAccess });
  } catch (error) {
    console.error("Subscription check error:", error);
    return NextResponse.json({ hasAccess: false });
  }
}
