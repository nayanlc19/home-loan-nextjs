"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chrome } from "lucide-react";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Home Loan Toolkit
          </h1>
          <p className="text-gray-600">
            Save ₹8-25 Lakhs on your home loan with proven strategies
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              What you'll get:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ 12 Proven payment strategies</li>
              <li>✓ Beautiful interactive calculators</li>
              <li>✓ Bank comparison with real data</li>
              <li>✓ Tax optimization tools</li>
              <li>✓ All for just ₹99 (one-time)</li>
            </ul>
          </div>

          <Button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
          >
            <Chrome className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>

          <p className="text-xs text-center text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </Card>
    </div>
  );
}
