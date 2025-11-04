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
import { calculateHomeLoanTaxBenefits, type TaxRegime } from "@/lib/tax-utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function LumpSumStrategy() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [lumpSum, setLumpSum] = useState(500000);
  const [prepaymentYear, setPrepaymentYear] = useState("1");
  const [taxableIncome, setTaxableIncome] = useState(1200000);
  const [regime, setRegime] = useState<TaxRegime>("old");

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

  // Calculate year 1 principal and interest for tax benefits
  let balance = loanAmount;
  let year1Principal = 0;
  let year1Interest = 0;

  for (let month = 1; month <= 12; month++) {
    const interest = balance * monthlyRate;
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

  const bestScenarioSavings = scenarios[0].saved;

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

        {/* Tax Benefits Card */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle>💰 Total Savings Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Interest Saved (Year 1 prepayment):</span>
                <span className="font-semibold">₹{bestScenarioSavings.toLocaleString("en-IN")}</span>
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
                  ₹{(bestScenarioSavings + taxBenefits.totalBenefit).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

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
