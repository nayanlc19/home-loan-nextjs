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

export default function TaxRefundStrategy() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [annualRefund, setAnnualRefund] = useState(50000);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Strategy #2: Tax Refund Amplification
            </h1>
            <p className="text-gray-600 mt-2">
              Use annual tax refunds for strategic prepayment
            </p>
          </div>
          <Link href="/strategies/all">
            <Button variant="outline">← All Strategies</Button>
          </Link>
        </div>

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
