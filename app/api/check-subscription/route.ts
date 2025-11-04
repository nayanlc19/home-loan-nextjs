import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { checkUserSubscription } from "@/lib/check-subscription";
import { rateLimit, getClientIp, RateLimitPresets } from "@/lib/rate-limiter";

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    const rateLimitResult = rateLimit(clientIp, RateLimitPresets.SUBSCRIPTION_CHECK);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    // CRITICAL SECURITY: Require authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    // CRITICAL SECURITY: Users can only check their own subscription
    if (email !== session.user.email) {
      console.warn(`User ${session.user.email} attempted to check subscription for ${email}`);
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const hasAccess = await checkUserSubscription(email);
    return NextResponse.json({ hasAccess });
  } catch (error) {
    console.error("Subscription check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
