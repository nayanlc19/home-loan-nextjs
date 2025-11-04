"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calculator, Coins } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatIndianCompactCurrency } from "@/lib/loan-utils";

export default function LumpSumStrategy() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [lumpSum, setLumpSum] = useState(500000);
  const [prepaymentYear, setPrepaymentYear] = useState("1");

  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = tenureYears * 12;
  const monthlyEMI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
                     (Math.pow(1 + monthlyRate, totalMonths) - 1);

  // Calculate different scenarios
  const scenarios = [1, 3, 5, 10].map(year => {
    let remaining = loanAmount;
    let totalInterest = 0;
    let months = 0;

    for (let m = 0; m < totalMonths; m++) {
      if (remaining <= 0) break;

      const interest = remaining * monthlyRate;
      const principal = monthlyEMI - interest;

      totalInterest += interest;
      remaining -= principal;
      months++;

      // Apply lump sum at specified year
      if (m === year * 12 - 1 && remaining > 0) {
        remaining = Math.max(0, remaining - lumpSum);
      }
    }

    return {
      year: `Year ${year}`,
      interest: Math.round(totalInterest),
      tenure: Math.round(months / 12 * 10) / 10,
      saved: Math.round((loanAmount * monthlyRate * totalMonths) - totalInterest)
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Strategy #3: Lump Sum Accelerator
            </h1>
            <p className="text-gray-600 mt-2">
              Compare timing impact of bonus/windfall prepayment
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
              Loan & Lump Sum Details
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
                <Label>Lump Sum Amount (₹)</Label>
                <Input
                  type="number"
                  value={lumpSum}
                  onChange={(e) => setLumpSum(Number(e.target.value))}
                  step="50000"
                />
              </div>
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

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-700">Lump Sum</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-700">
                ₹{lumpSum.toLocaleString('en-IN')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-700">Best Timing</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-700">
                Year 1 (Earliest)
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Timing Comparison
            </CardTitle>
            <CardDescription>
              See how prepayment timing affects total interest and tenure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={scenarios}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  label={{ value: 'Interest', angle: -90, position: 'insideLeft' }}
                  tickFormatter={(value) => formatIndianCompactCurrency(value)}
                />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Tenure (Years)', angle: 90, position: 'insideRight' }} />
                <Tooltip formatter={(value, name) => {
                  if (name === 'Total Interest') return `₹${Number(value).toLocaleString('en-IN')}`;
                  return `${value} years`;
                }} />
                <Legend />
                <Bar yAxisId="left" dataKey="interest" fill="#ef4444" name="Total Interest" />
                <Bar yAxisId="right" dataKey="tenure" fill="#3b82f6" name="Tenure (Years)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">💡 Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="text-amber-800">
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Earlier is Better:</strong> Prepaying in Year 1 saves significantly more than Year 10</li>
              <li><strong>Compound Effect:</strong> Every ₹1 lakh early saves ₹2-3 lakhs in interest</li>
              <li><strong>Flexibility:</strong> Choose to reduce EMI or reduce tenure after prepayment</li>
              <li><strong>Sources:</strong> Bonus, inheritance, insurance maturity, stock gains</li>
              <li><strong>Tax Smart:</strong> No tax on using your own money for prepayment!</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
