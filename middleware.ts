import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: [
    /*
     * Only protect specific authenticated routes:
     * - /dashboard (user dashboard)
     * - /checkout (payment pages)
     * - /profile (user profile)
     * Public routes like /, /strategies, /banks, /calculators are accessible to everyone
     */
    "/dashboard/:path*",
    "/checkout/:path*",
    "/profile/:path*",
  ],
};
