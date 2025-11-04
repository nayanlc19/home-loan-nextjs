"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calculator, IndianRupee, FileText, Home, Shield, Coins } from "lucide-react";
import Link from "next/link";

const stateStampDuty = {
  "Maharashtra": 5,
  "Karnataka": 5,
  "Delhi": 6,
  "Uttar Pradesh": 7,
  "Gujarat": 4.9,
  "Tamil Nadu": 7,
  "Telangana": 4,
  "West Bengal": 6,
  "Rajasthan": 5,
  "Punjab": 7,
  "Haryana": 7,
  "Kerala": 8,
  "Other": 6
};

export default function HiddenCostsPage() {
  const [propertyValue, setPropertyValue] = useState(5000000);
  const [loanAmount, setLoanAmount] = useState(3500000);
  const [state, setState] = useState("Maharashtra");
  const [buyerGender, setBuyerGender] = useState("male");
  const [constructionStatus, setConstructionStatus] = useState("ready");

  // Calculations
  const processingFee = loanAmount * 0.005; // 0.5%
  const processingFeeWithGST = processingFee * 1.18;

  const loginFees = 7500;
  const technicalFees = 4000;
  const legalFees = 6000;

  const stampDutyRate = stateStampDuty[state as keyof typeof stateStampDuty] || 6;
  const stampDutyDiscount = buyerGender === "female" ? 1 : 0;
  const finalStampDutyRate = Math.max(stampDutyRate - stampDutyDiscount, 0);
  const stampDuty = (propertyValue * finalStampDutyRate) / 100;

  const registrationCharges = propertyValue > 3000000 ? 30000 : 20000;

  const insurance = 15000;

  const preEMIInterest = constructionStatus === "under-construction"
    ? (loanAmount * 0.085 * 0.5) // Assuming 6 months average construction delay
    : 0;

  const totalOneTime = processingFeeWithGST + loginFees + technicalFees + legalFees +
                       stampDuty + registrationCharges + insurance + preEMIInterest;

  const downPayment = propertyValue - loanAmount;
  const totalCashNeeded = downPayment + totalOneTime;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Hidden Costs Calculator
            </h1>
            <p className="text-gray-600 mt-2">
              Calculate ALL the costs banks don't tell you upfront
            </p>
          </div>
          <Link href="/guides/tips">
            <Button variant="outline">← Back to Tips</Button>
          </Link>
        </div>

        {/* Warning */}
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-red-800">
                <strong>Critical Warning:</strong> I've seen people who had exactly ₹15L saved, found ₹50L property,
                thought "30% down = perfect", then discovered they needed ₹18.5L total (₹15L + ₹3.5L hidden costs)!
                <br/><br/>
                <strong>Rule of thumb:</strong> Budget property cost + <strong>7-8% for ALL hidden charges</strong>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Property & Loan Details
            </CardTitle>
            <CardDescription>
              Enter your property and loan information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Property Value (₹)</Label>
                <Input
                  type="number"
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(Number(e.target.value))}
                  step="100000"
                />
              </div>
              <div className="space-y-2">
                <Label>Loan Amount (₹)</Label>
                <Input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  step="100000"
                />
                <p className="text-xs text-gray-500">
                  Down payment: ₹{(propertyValue - loanAmount).toLocaleString('en-IN')}
                  ({((propertyValue - loanAmount) / propertyValue * 100).toFixed(1)}%)
                </p>
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(stateStampDuty).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s} ({stateStampDuty[s as keyof typeof stateStampDuty]}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Property Buyer</Label>
                <Select value={buyerGender} onValueChange={setBuyerGender}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male (Standard rate)</SelectItem>
                    <SelectItem value="female">Female (1-2% discount)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Property Status</Label>
                <Select value={constructionStatus} onValueChange={setConstructionStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ready">Ready to Move</SelectItem>
                    <SelectItem value="under-construction">Under Construction</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-700">Down Payment</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-700">
                ₹{downPayment.toLocaleString('en-IN')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="pb-3">
              <CardDescription className="text-red-700">Hidden Costs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-700">
                ₹{totalOneTime.toLocaleString('en-IN')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-700">Total Cash Needed</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-700">
                ₹{totalCashNeeded.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-purple-600 mt-2">
                {((totalCashNeeded / propertyValue) * 100).toFixed(1)}% of property value
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Cost Breakdown</CardTitle>
            <CardDescription>Every rupee you need to pay upfront</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Bank Charges */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-blue-600" />
                Bank Charges
              </h3>
              <div className="space-y-2 ml-7">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">Processing Fee</span>
                    <p className="text-xs text-gray-600">0.5% of loan amount + 18% GST</p>
                  </div>
                  <span className="font-semibold">₹{processingFeeWithGST.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">Login / Admin Fees</span>
                    <p className="text-xs text-gray-600">One-time charges (negotiable)</p>
                  </div>
                  <span className="font-semibold">₹{loginFees.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">Technical Valuation</span>
                    <p className="text-xs text-gray-600">Property inspection</p>
                  </div>
                  <span className="font-semibold">₹{technicalFees.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">Legal Verification</span>
                    <p className="text-xs text-gray-600">Title check & documentation</p>
                  </div>
                  <span className="font-semibold">₹{legalFees.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Government Charges */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Government Charges (Non-Negotiable)
              </h3>
              <div className="space-y-2 ml-7">
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded border border-purple-200">
                  <div>
                    <span className="font-medium">Stamp Duty</span>
                    <p className="text-xs text-gray-600">
                      {finalStampDutyRate}% of property value
                      {buyerGender === "female" && " (Female buyer discount applied!)"}
                    </p>
                  </div>
                  <span className="font-bold text-purple-700">₹{stampDuty.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">Registration Charges</span>
                    <p className="text-xs text-gray-600">Government property registration</p>
                  </div>
                  <span className="font-semibold">₹{registrationCharges.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Insurance */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Insurance
              </h3>
              <div className="space-y-2 ml-7">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-200">
                  <div>
                    <span className="font-medium">Home Loan Insurance</span>
                    <p className="text-xs text-gray-600">
                      First year premium (You can say NO for floating rate!)
                    </p>
                  </div>
                  <span className="font-semibold text-green-700">₹{insurance.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Pre-EMI Interest */}
            {constructionStatus === "under-construction" && (
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Home className="h-5 w-5 text-orange-600" />
                  Pre-EMI Interest
                </h3>
                <div className="space-y-2 ml-7">
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded border border-orange-200">
                    <div>
                      <span className="font-medium">Interest During Construction</span>
                      <p className="text-xs text-gray-600">
                        Estimated for ~6 months (varies by project)
                      </p>
                    </div>
                    <span className="font-bold text-orange-700">₹{preEMIInterest.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg border-2 border-purple-300">
                <div>
                  <span className="text-xl font-bold">Total Hidden Costs</span>
                  <p className="text-sm text-gray-600">Not including down payment</p>
                </div>
                <span className="text-3xl font-bold text-purple-700">
                  ₹{totalOneTime.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">💡 Pro Tips to Reduce Hidden Costs</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">✓</span>
                <span><strong>Negotiate processing fees:</strong> Banks often waive or reduce to 0.25% for good credit scores</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">✓</span>
                <span><strong>Female buyer discount:</strong> Register property in wife's name for 1-2% stamp duty discount</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">✓</span>
                <span><strong>Skip loan insurance:</strong> For floating rate loans, you can decline and buy cheaper term insurance separately</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">✓</span>
                <span><strong>Login fees:</strong> Ask to waive these "admin charges" - they're often negotiable</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">✓</span>
                <span><strong>Total budget rule:</strong> Property cost + 7-8% buffer = Total cash needed</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Now That You Know the Full Cost...</h3>
            <p className="mb-6 opacity-90">
              Learn our 12 proven strategies to save ₹8-25 Lakhs on your loan
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/strategies/all">
                <Button size="lg" variant="secondary">
                  View All Strategies →
                </Button>
              </Link>
              <Link href="/guides/tips">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                  Back to Tips & Tricks
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
