"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calculator, CreditCard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OverdraftStrategy() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [overdraftAmount, setOverdraftAmount] = useState(1000000);
  const [overdraftRate, setOverdraftRate] = useState(10.5);

  const monthlyRate = interestRate / 100 / 12;
  const overdraftMonthlyRate = overdraftRate / 100 / 12;
  const totalMonths = tenureYears * 12;

  // Calculate standard EMI
  const monthlyEMI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
                     (Math.pow(1 + monthlyRate, totalMonths) - 1);

  // Calculate with overdraft drawn at different stages
  const scenarios = [];

  // Scenario 1: No overdraft (baseline)
  const totalInterestStandard = (monthlyEMI * totalMonths) - loanAmount;

  // Scenario 2: Overdraft after 2 years, 5 years, 10 years
  for (const year of [2, 5, 10]) {
    let remaining = loanAmount;
    let totalInterest = 0;
    let overdraftOutstanding = 0;
    let monthsToPayOD = 0;
    let odMonthsUsed = 0;

    for (let m = 0; m < totalMonths; m++) {
      const interest = remaining * monthlyRate;
      const principal = monthlyEMI - interest;

      totalInterest += interest;
      remaining -= principal;

      // Draw overdraft at specified year
      if (m === year * 12 && overdraftOutstanding === 0) {
        overdraftOutstanding = overdraftAmount;
        remaining = Math.max(0, remaining - overdraftAmount);
      }

      // Pay interest on overdraft if used
      if (overdraftOutstanding > 0) {
        const odInterest = overdraftOutstanding * overdraftMonthlyRate;
        totalInterest += odInterest;
        odMonthsUsed++;

        // Assume overdraft paid back in 5 years
        if (odMonthsUsed <= 60) {
          const odPayment = overdraftAmount / 60;
          overdraftOutstanding = Math.max(0, overdraftOutstanding - odPayment);
        }
      }

      if (remaining <= 0 && overdraftOutstanding <= 0) break;
    }

    scenarios.push({
      year: `Year ${year}`,
      interest: Math.round(totalInterest),
      savings: Math.round(totalInterestStandard - totalInterest)
    });
  }

  // Add baseline
  scenarios.unshift({
    year: "No OD",
    interest: Math.round(totalInterestStandard),
    savings: 0
  });

  const bestScenario = scenarios.reduce((best, curr) =>
    curr.savings > best.savings ? curr : best
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Strategy #5: Overdraft Optimization
            </h1>
            <p className="text-gray-600 mt-2">
              Manage surplus funds through overdraft facility
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
              Loan & Overdraft Details
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
                <Label>Loan Interest Rate (%)</Label>
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
                <Label>Overdraft Amount (₹)</Label>
                <Input
                  type="number"
                  value={overdraftAmount}
                  onChange={(e) => setOverdraftAmount(Number(e.target.value))}
                  step="100000"
                />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Label>Overdraft Interest Rate (%)</Label>
              <Input
                type="number"
                value={overdraftRate}
                onChange={(e) => setOverdraftRate(Number(e.target.value))}
                step="0.1"
                className="mt-2 max-w-xs"
              />
              <p className="text-xs text-gray-500 mt-2">Usually 2-3% higher than home loan rate</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Monthly EMI</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₹{Math.round(monthlyEMI).toLocaleString('en-IN')}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-700">Overdraft Available</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-700">
                ₹{overdraftAmount.toLocaleString('en-IN')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-700">Max Savings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-700">
                ₹{bestScenario.savings.toLocaleString('en-IN')}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Timing Comparison
            </CardTitle>
            <CardDescription>
              Interest paid at different overdraft draw timings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={scenarios}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" label={{ value: 'Total Interest (₹)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Savings (₹)', angle: 90, position: 'insideRight' }} />
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                <Legend />
                <Bar yAxisId="left" dataKey="interest" fill="#ef4444" name="Total Interest" />
                <Bar yAxisId="right" dataKey="savings" fill="#10b981" name="Interest Saved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">How Overdraft Works</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>What is it?</strong> A credit facility allowing flexible borrowing against your home loan</li>
              <li><strong>Interest Calculation:</strong> Only pay interest on amount actually used, not approved limit</li>
              <li><strong>Flexibility:</strong> Withdraw and repay as needed - no fixed tenure</li>
              <li><strong>Cost:</strong> Usually 0.5-3% higher rate than main loan</li>
              <li><strong>Best Use:</strong> Park surplus in savings account, pay EMI from overdraft, withdraw as needed</li>
              <li><strong>Approval:</strong> Typically approved up to 50-80% of approved loan amount</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">💡 Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="text-amber-800">
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Flexibility Edge:</strong> Keep money in savings, use OD as backup for emergencies</li>
              <li><strong>Early Years Matter:</strong> Using OD early compounds more savings</li>
              <li><strong>Cash Management:</strong> Better than FDs - keep liquid funds accessible</li>
              <li><strong>Interest Advantage:</strong> Tax deductible (Section 24) even on OD portion</li>
              <li><strong>Strategy Tip:</strong> Draw early years when loan balance is high for max impact</li>
              <li><strong>Caution:</strong> Don't spend OD funds on non-essentials; use for investments only</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
