"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Loader2 } from "lucide-react";
import Link from "next/link";

export default function StrategyAccessGuard({ children, strategyNumber }: { children: React.ReactNode, strategyNumber: number }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      // Strategy #9 (Bi-Weekly) is free - no check needed
      if (strategyNumber === 9) {
        setHasAccess(true);
        setLoading(false);
        return;
      }

      if (status === "loading") return;

      if (!session?.user?.email) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/check-subscription?email=${session.user.email}`);
        const data = await res.json();
        setHasAccess(data.hasAccess);
      } catch (error) {
        console.error("Error checking subscription:", error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [session, status, strategyNumber]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Sign In Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Please sign in to access this strategy.</p>
            <Link href="/auth/signin">
              <Button className="w-full">Sign In with Google</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-2 border-yellow-300">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-yellow-600" />
              Premium Strategy - ₹99 for All 11 Strategies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <p className="text-gray-700">
              Strategy #{strategyNumber} is part of our premium collection. Get lifetime access to all 11 advanced strategies for just ₹99!
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✅ All 11 Advanced Strategies</li>
              <li>✅ Tax Benefits Calculator</li>
              <li>✅ Personalized Rate Finder</li>
              <li>✅ 1 Year Access</li>
            </ul>
            <Link href="/checkout">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                Unlock All Strategies - ₹99
              </Button>
            </Link>
            <Link href="/strategies">
              <Button variant="outline" className="w-full">
                Try Free Strategy First
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
