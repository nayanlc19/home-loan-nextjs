"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Calculator, TrendingDown, Clock, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatIndianCompactCurrency } from "@/lib/loan-utils";
import { calculateHomeLoanTaxBenefits, type TaxRegime } from "@/lib/tax-utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function TaxRefundStrategy() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [annualRefund, setAnnualRefund] = useState(50000);
  const [taxableIncome, setTaxableIncome] = useState(1200000);
  const [regime, setRegime] = useState<TaxRegime>("old");

  // Calculate results
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = tenureYears * 12;

  // Standard EMI
  const monthlyEMI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
                     (Math.pow(1 + monthlyRate, totalMonths) - 1);

  // Calculate with annual prepayments
  let remainingPrincipal = loanAmount;
  let totalInterestWithRefund = 0;
  let monthsWithRefund = 0;
  const yearlyData = [];

  for (let year = 0; year < tenureYears; year++) {
    if (remainingPrincipal <= 0) break;

    let yearInterest = 0;

    // 12 monthly payments
    for (let month = 0; month < 12; month++) {
      if (remainingPrincipal <= 0) break;

      const interest = remainingPrincipal * monthlyRate;
      const principal = monthlyEMI - interest;

      yearInterest += interest;
      remainingPrincipal -= principal;
      monthsWithRefund++;
    }

    totalInterestWithRefund += yearInterest;

    // Annual prepayment from tax refund
    if (remainingPrincipal > 0 && annualRefund > 0) {
      remainingPrincipal = Math.max(0, remainingPrincipal - annualRefund);
    }

    yearlyData.push({
      year: year + 1,
      remaining: Math.max(0, Math.round(remainingPrincipal)),
      prepayment: annualRefund,
      saved: Math.round((totalMonths - monthsWithRefund) * monthlyEMI - remainingPrincipal)
    });
  }

  // Standard loan calculation
  const totalPaymentStandard = monthlyEMI * totalMonths;
  const totalInterestStandard = totalPaymentStandard - loanAmount;

  const tenureSaved = totalMonths - monthsWithRefund;
  const moneySaved = totalInterestStandard - totalInterestWithRefund;

  // Calculate year 1 principal and interest for tax benefits
  const monthlyRateCalc = interestRate / 100 / 12;
  let balance = loanAmount;
  let year1Principal = 0;
  let year1Interest = 0;

  for (let month = 1; month <= 12; month++) {
    const interest = balance * monthlyRateCalc;
    const principal = monthlyEMI - interest;
    year1Principal += principal;
    year1Interest += interest;
    balance -= principal;
  }

  const taxBenefits = calculateHomeLoanTaxBenefits(
    year1Principal,
    year1Interest,
    taxableIncome,
    "self-occupied",
    regime
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Strategy #10: Tax Refund Amplification
            </h1>
            <p className="text-gray-600 mt-2">
              Use annual tax refunds for strategic prepayment
            </p>
          </div>
          <Link href="/strategies/all">
            <Button variant="outline">← All Strategies</Button>
          </Link>
        </div>

        {/* Rationale & Execution */}
        <Card className="mb-6 border-l-4 border-l-blue-600">
          <CardHeader>
            <CardTitle className="text-lg">📘 Why This Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Home loans give you tax deductions under Section 80C (₹1.5L on principal) and Section 24(b) (₹2L on interest). For someone in 30% tax bracket, that's ₹50k-80k annual refund! Instead of splurging that refund, prepay your loan with it. It creates a virtuous cycle: loan reduces → next year's interest reduces → more principal gets tax benefit → bigger refund → faster prepayment!
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-900">📋 How to Execute:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>File ITR every year before July 31st (declare home loan interest under 24(b))</li>
                <li>Claim principal repayment under 80C (max ₹1.5L including PPF, ELSS, etc)</li>
                <li>Track your refund status on income tax portal (processed in 15-90 days)</li>
                <li>When refund hits bank account, transfer IMMEDIATELY to loan prepayment</li>
                <li>Don't let refund "sit" in savings - it loses purchasing power to inflation</li>
                <li>Set annual reminder: File ITR in April → Get refund by Aug → Prepay in Sept</li>
                <li>For ₹50k annual prepayment over 20 years = ₹6-10L interest saved!</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Input Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Loan Details
            </CardTitle>
            <CardDescription>
              Enter your home loan information and expected annual tax refund
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="loan">Loan Amount (₹)</Label>
                <Input
                  id="loan"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  step="100000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Interest Rate (%)</Label>
                <Input
                  id="rate"
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenure">Tenure (Years)</Label>
                <Input
                  id="tenure"
                  type="number"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="refund">Annual Tax Refund (₹)</Label>
                <Input
                  id="refund"
                  type="number"
                  value={annualRefund}
                  onChange={(e) => setAnnualRefund(Number(e.target.value))}
                  step="10000"
                />
              </div>
            </div>

            {/* Tax Calculation Inputs */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Tax Benefits (Year 1)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="taxableIncome">Annual Taxable Income (₹)</Label>
                  <Input
                    id="taxableIncome"
                    type="number"
                    value={taxableIncome}
                    onChange={(e) => setTaxableIncome(Number(e.target.value))}
                  />
                  <p className="text-xs text-gray-500">
                    ₹{taxableIncome.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Tax Regime</Label>
                  <RadioGroup value={regime} onValueChange={(value) => setRegime(value as TaxRegime)}>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="old" id="regime-old" />
                        <Label htmlFor="regime-old" className="font-normal cursor-pointer">Old Regime</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="new" id="regime-new" />
                        <Label htmlFor="regime-new" className="font-normal cursor-pointer">New Regime</Label>
                      </div>
                    </div>
                  </RadioGroup>
                  <p className="text-xs text-gray-500">
                    {regime === "old" ? "With deductions" : "No deductions"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Monthly EMI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₹{Math.round(monthlyEMI).toLocaleString('en-IN')}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2 text-green-700">
                <DollarSign className="h-4 w-4" />
                Interest Saved
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-700">
                ₹{Math.round(moneySaved).toLocaleString('en-IN')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2 text-blue-700">
                <Clock className="h-4 w-4" />
                Time Saved
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-700">
                {Math.floor(tenureSaved / 12)} years {tenureSaved % 12} months
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2 text-purple-700">
                <TrendingDown className="h-4 w-4" />
                New Tenure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-700">
                {Math.floor(monthsWithRefund / 12)} years {monthsWithRefund % 12} months
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tax Benefits Card */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle>💰 Total Savings Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Interest Saved:</span>
                <span className="font-semibold">₹{moneySaved.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax Benefits (Annual):</span>
                <span className="font-semibold text-blue-600">
                  + ₹{taxBenefits.totalBenefit.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span className="ml-4">└─ Section 80C:</span>
                <span>₹{taxBenefits.section80c.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span className="ml-4">└─ Section 24(b):</span>
                <span>₹{taxBenefits.section24b.toLocaleString("en-IN")}</span>
              </div>

              <div className="border-t pt-3 flex justify-between">
                <span className="text-xl font-bold">Net Benefit:</span>
                <span className="text-xl font-bold text-green-600">
                  ₹{(moneySaved + taxBenefits.totalBenefit).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <Card>
          <CardHeader>
            <CardTitle>Year-by-Year Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="principal" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="principal">Principal Reduction</TabsTrigger>
                <TabsTrigger value="savings">Cumulative Savings</TabsTrigger>
              </TabsList>

              <TabsContent value="principal" className="space-y-4">
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={yearlyData}>
                    <defs>
                      <linearGradient id="colorRemaining" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                    <YAxis
                      label={{ value: 'Amount', angle: -90, position: 'insideLeft' }}
                      tickFormatter={(value) => formatIndianCompactCurrency(value)}
                    />
                    <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="remaining"
                      stroke="#8b5cf6"
                      fillOpacity={1}
                      fill="url(#colorRemaining)"
                      name="Remaining Principal"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="savings" className="space-y-4">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                    <YAxis
                      label={{ value: 'Amount', angle: -90, position: 'insideLeft' }}
                      tickFormatter={(value) => formatIndianCompactCurrency(value)}
                    />
                    <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                    <Legend />
                    <Bar dataKey="saved" fill="#10b981" name="Total Savings" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">How This Strategy Works</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <ul className="space-y-2 list-disc list-inside">
              <li>Claim tax deductions under Section 80C (₹1.5L) and 24(b) (₹2L interest)</li>
              <li>Use annual tax refund (typically ₹30,000-₹70,000) for prepayment</li>
              <li>Each prepayment reduces principal, creating compounding effect</li>
              <li>Over 20 years, can save ₹6-10 lakhs in interest</li>
              <li>No lifestyle change needed - just redirect tax savings!</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
