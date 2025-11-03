import { Suspense } from "react";
import PaymentCallbackContent from "./payment-callback-content";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-6">
        <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto" />
        <h2 className="text-2xl font-bold">Loading...</h2>
        <p className="text-gray-600">Please wait</p>
      </Card>
    </div>
  );
}

export default function PaymentCallback() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentCallbackContent />
    </Suspense>
  );
}
