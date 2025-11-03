"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function PaymentCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");

  useEffect(() => {
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      setStatus("failed");
      return;
    }

    // Verify payment status
    fetch(`/api/payment/verify?orderId=${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      })
      .catch(() => {
        setStatus("failed");
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-6">
        {status === "loading" && (
          <>
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto" />
            <h2 className="text-2xl font-bold">Verifying Payment...</h2>
            <p className="text-gray-600">Please wait while we confirm your payment</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
            <p className="text-gray-600">
              Thank you for your purchase. You now have access to all 12 strategies!
            </p>
            <Button
              onClick={() => router.push("/strategies")}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
            >
              View All Strategies
            </Button>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle className="h-16 w-16 text-red-600 mx-auto" />
            <h2 className="text-2xl font-bold text-red-600">Payment Failed</h2>
            <p className="text-gray-600">
              Something went wrong with your payment. Please try again.
            </p>
            <Button
              onClick={() => router.push("/checkout")}
              variant="outline"
              className="w-full"
            >
              Try Again
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
