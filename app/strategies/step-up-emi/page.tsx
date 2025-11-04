"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calculator, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatIndianCompactCurrency } from "@/lib/loan-utils";

export default function StepUpEMIStrategy() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [initialEMIPercent, setInitialEMIPercent] = useState(50);
  const [annualIncrease, setAnnualIncrease] = useState(10);

  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = tenureYears * 12;

  // Calculate standard EMI
  const standardEMI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
                      (Math.pow(1 + monthlyRate, totalMonths) - 1);

  // Step-up EMI calculation
  const initialEMI = standardEMI * (initialEMIPercent / 100);
  const monthlyIncrease = (annualIncrease / 100) / 12;

  let remainingLoanStandard = loanAmount;
  let remainingLoanStepUp = loanAmount;
  let totalInterestStandard = 0;
  let totalInterestStepUp = 0;
  let monthsStepUp = 0;
  const yearData = [];

  for (let month = 0; month < totalMonths; month++) {
    // Standard loan
    if (remainingLoanStandard > 0) {
      const interest = remainingLoanStandard * monthlyRate;
      const principal = standardEMI - interest;
      totalInterestStandard += interest;
      remainingLoanStandard -= principal;
    }

    // Step-up loan
    if (remainingLoanStepUp > 0) {
      const currentEMI = initialEMI * Math.pow(1 + monthlyIncrease, month);
      const interest = remainingLoanStepUp * monthlyRate;
      const principal = Math.max(0, currentEMI - interest);
      totalInterestStepUp += interest;
      remainingLoanStepUp -= principal;
      monthsStepUp++;
    }

    // Store year data
    if ((month + 1) % 12 === 0) {
      const year = (month + 1) / 12;
      const emiAtYear = initialEMI * Math.pow(1 + monthlyIncrease, month);
      yearData.push({
        year,
        currentEMI: Math.round(emiAtYear),
        standardLoanRemaining: Math.max(0, Math.round(remainingLoanStandard)),
        stepUpLoanRemaining: Math.max(0, Math.round(remainingLoanStepUp))
      });
    }
  }

  const interestSaved = totalInterestStandard - totalInterestStepUp;
  const tenureSaved = totalMonths - monthsStepUp;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Strategy #6: Step-Up EMI
            </h1>
            <p className="text-gray-600 mt-2">
              Start low, increase EMI with salary increments
            </p>
          </div>
          <Link href="/strategies/all">
            <Button variant="outline">← All Strategies</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Step-Up EMI Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label>Loan Amount (₹)</Label>
                <Input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  step="100000"
                />
              </div>
              <div className="space-y-2">
                <Label>Interest Rate (%)</Label>
                <Input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label>Tenure (Years)</Label>
                <Input
                  type="number"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Initial EMI (% of standard)</Label>
                <Input
                  type="number"
                  value={initialEMIPercent}
                  onChange={(e) => setInitialEMIPercent(Number(e.target.value))}
                  step="5"
                  min="30"
                  max="100"
                />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Label>Annual EMI Increase (%)</Label>
              <Input
                type="number"
                value={annualIncrease}
                onChange={(e) => setAnnualIncrease(Number(e.target.value))}
                step="1"
                className="mt-2 max-w-xs"
              />
              <p className="text-xs text-gray-500 mt-2">Align with expected salary increments (typically 5-15%)</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Standard EMI</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₹{Math.round(standardEMI).toLocaleString('en-IN')}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-700">Initial EMI</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-700">
                ₹{Math.round(initialEMI).toLocaleString('en-IN')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-700">Interest Saved</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-700">
                ₹{Math.round(interestSaved).toLocaleString('en-IN')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-700">Time Saved</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-700">
                {Math.floor(tenureSaved / 12)} years
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              EMI Growth & Loan Reduction
            </CardTitle>
            <CardDescription>
              Watch your EMI grow with salary while loan balance shrinks faster
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={yearData}>
                <defs>
                  <linearGradient id="colorStepUp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorStandard" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                <YAxis
                  label={{ value: 'Loan Remaining', angle: -90, position: 'insideLeft' }}
                  tickFormatter={(value) => formatIndianCompactCurrency(value)}
                />
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="standardLoanRemaining"
                  stroke="#ef4444"
                  fill="url(#colorStandard)"
                  name="Standard Loan Balance"
                  stackId="1"
                />
                <Area
                  type="monotone"
                  dataKey="stepUpLoanRemaining"
                  stroke="#10b981"
                  fill="url(#colorStepUp)"
                  name="Step-Up Loan Balance"
                  stackId="2"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">How Step-Up EMI Works</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Year 1-5:</strong> Pay lower EMI (50-70% of standard) when early career earnings are lower</li>
              <li><strong>Salary Growth:</strong> As your salary increases with promotions, EMI increases accordingly</li>
              <li><strong>Affordability:</strong> Better budget alignment - EMI percentage stays constant relative to income</li>
              <li><strong>Timeline:</strong> Loan still finishes on time despite lower initial EMI</li>
              <li><strong>Customization:</strong> Varies with actual salary growth - no fixed step-up required</li>
              <li><strong>Qualification:</strong> Easier approval as initial EMI is lower burden on income</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">💡 Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="text-amber-800">
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Best For Young Professionals:</strong> Those expecting significant salary growth</li>
              <li><strong>Cash Flow Advantage:</strong> ₹{Math.round(standardEMI - initialEMI).toLocaleString('en-IN')} extra monthly budget in early years</li>
              <li><strong>Interest Trade-off:</strong> Saves ₹{Math.round(interestSaved / 100000)} lakhs vs standard fixed EMI</li>
              <li><strong>Flexible Strategy:</strong> Can accelerate EMI growth if salary grows faster than expected</li>
              <li><strong>Avoid Risk:</strong> Don't miss salary growth - EMI must increase as planned</li>
              <li><strong>Top-Up Option:</strong> Can convert to higher EMI anytime if finances improve</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
