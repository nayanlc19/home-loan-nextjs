"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calculator, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatIndianCompactCurrency } from "@/lib/loan-utils";
import { calculateHomeLoanTaxBenefits, type TaxRegime } from "@/lib/tax-utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SIPVsPrepayStrategy() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [sipAmount, setSipAmount] = useState(10000);
  const [sipReturns, setSipReturns] = useState(12);
  const [taxableIncome, setTaxableIncome] = useState(1200000);
  const [regime, setRegime] = useState<TaxRegime>("old");

  const monthlyRate = interestRate / 100 / 12;
  const sipMonthlyRate = sipReturns / 100 / 12;
  const totalMonths = tenureYears * 12;

  // Calculate standard EMI
  const monthlyEMI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
                     (Math.pow(1 + monthlyRate, totalMonths) - 1);

  // Calculate total interest without prepayment
  const totalInterestStandard = (monthlyEMI * totalMonths) - loanAmount;

  // Scenario 1: Prepay with SIP amount
  let remainingLoanPrepay = loanAmount;
  let totalInterestPrepay = 0;
  let monthsPrepay = 0;

  for (let m = 0; m < totalMonths; m++) {
    if (remainingLoanPrepay <= 0) break;

    const interest = remainingLoanPrepay * monthlyRate;
    const principal = monthlyEMI - interest;

    totalInterestPrepay += interest;
    remainingLoanPrepay -= principal;
    monthsPrepay++;

    // Prepay with SIP amount
    if (remainingLoanPrepay > 0) {
      remainingLoanPrepay = Math.max(0, remainingLoanPrepay - sipAmount);
    }
  }

  // Scenario 2: SIP investment (not prepaying)
  let sipValue = 0;
  for (let m = 0; m < totalMonths; m++) {
    sipValue = sipValue * (1 + sipMonthlyRate) + sipAmount;
  }

  // Calculate year-by-year comparison
  const yearData = [];
  let remLoanPrepay = loanAmount;
  let remLoanStandard = loanAmount;
  let sipVal = 0;

  for (let year = 0; year <= tenureYears; year++) {
    for (let month = 0; month < 12 && year * 12 + month < totalMonths; month++) {
      const intStandard = remLoanStandard * monthlyRate;
      const prinStandard = monthlyEMI - intStandard;
      remLoanStandard -= prinStandard;

      const intPrepay = remLoanPrepay * monthlyRate;
      const prinPrepay = monthlyEMI - intPrepay;
      remLoanPrepay -= prinPrepay;
      if (remLoanPrepay > 0) {
        remLoanPrepay = Math.max(0, remLoanPrepay - sipAmount);
      }

      sipVal = sipVal * (1 + sipMonthlyRate) + sipAmount;
    }

    yearData.push({
      year,
      prepayLoanRemaining: Math.max(0, Math.round(remLoanPrepay)),
      standardLoanRemaining: Math.max(0, Math.round(remLoanStandard)),
      sipValue: Math.round(sipVal),
    });
  }

  const netWealthPrepay = sipValue - remainingLoanPrepay;
  const netWealthStandard = sipValue - loanAmount;
  const wealthDifference = netWealthPrepay - netWealthStandard;
  const interestSaved = totalInterestStandard - totalInterestPrepay;

  // Calculate year 1 principal and interest for tax benefits
  const monthlyRate2 = interestRate / 100 / 12;
  let balance = loanAmount;
  let year1Principal = 0;
  let year1Interest = 0;

  for (let month = 1; month <= 12; month++) {
    const interest = balance * monthlyRate2;
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Strategy #5: SIP vs Prepayment
            </h1>
            <p className="text-gray-600 mt-2">
              Compare: Prepay loan vs Invest in market through SIP
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
              The math is simple: if equity SIP returns (12-15%) exceed your home loan rate after tax (6-7%), investing wins. But life isn't just math - it's also about sleep at night. Loan prepayment gives GUARANTEED returns equal to your interest rate, zero risk. SIP can crash 40% in bear markets. The "right" answer depends on your risk appetite, age, and financial goals.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-900">📋 How to Execute:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Calculate your effective loan rate after 80C and 24(b) tax benefits (typically 6-7%)</li>
                <li>Set realistic SIP expectations: 12% (conservative), 15% (aggressive), 18% (very aggressive)</li>
                <li>Age rule: If you're under 40, favor SIP. Over 50, favor prepayment.</li>
                <li>Risk rule: Can you handle seeing ₹10L become ₹6L in a crash? If no → prepay</li>
                <li>Hybrid approach: Split 50-50 between SIP and prepayment for balanced growth</li>
                <li>Review annually: If SIP outperforms for 3 years, increase SIP%. Vice versa.</li>
                <li>Set up auto-debit for discipline - whether SIP or prepayment</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Loan & Investment Details
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
                <Label>Monthly SIP Amount (₹)</Label>
                <Input
                  type="number"
                  value={sipAmount}
                  onChange={(e) => setSipAmount(Number(e.target.value))}
                  step="1000"
                />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Label>Expected Annual SIP Returns (%)</Label>
              <Input
                type="number"
                value={sipReturns}
                onChange={(e) => setSipReturns(Number(e.target.value))}
                step="0.5"
                className="mt-2 max-w-xs"
              />
              <p className="text-xs text-gray-500 mt-2">Typical equity SIP: 10-14% annual</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Monthly EMI</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₹{Math.round(monthlyEMI).toLocaleString('en-IN')}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-700">Interest Saved (Prepay)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-700">
                ₹{Math.round(interestSaved).toLocaleString('en-IN')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-700">SIP Value (20 years)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-700">
                ₹{Math.round(sipValue).toLocaleString('en-IN')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-700">Better Choice</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-700">
                {wealthDifference > 0 ? "📈 SIP Wins" : "💰 Prepay Wins"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Principal Reduction Comparison
            </CardTitle>
            <CardDescription>
              See how loan balance decreases with prepayment vs staying with standard EMI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={yearData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                <YAxis
                  label={{ value: 'Loan Balance', angle: -90, position: 'insideLeft' }}
                  tickFormatter={(value) => formatIndianCompactCurrency(value)}
                />
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="standardLoanRemaining"
                  stroke="#ef4444"
                  name="Standard EMI"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="prepayLoanRemaining"
                  stroke="#10b981"
                  name="With Prepayment"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="sipValue"
                  stroke="#3b82f6"
                  name="SIP Value"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle>💰 Total Savings Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Interest Saved:</span>
                <span className="font-semibold">₹{Math.round(interestSaved).toLocaleString("en-IN")}</span>
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
                  ₹{(Math.round(interestSaved) + taxBenefits.totalBenefit).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">💡 Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="text-amber-800">
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Prepayment Advantage:</strong> Guaranteed 8.5% return (your interest rate)</li>
              <li><strong>SIP Advantage:</strong> Higher returns (12%+) if markets perform well</li>
              <li><strong>The Math:</strong> If your SIP {'>'}  Interest Rate, SIP wins long-term wealth</li>
              <li><strong>Risk Factor:</strong> SIP has market risk, prepayment is risk-free</li>
              <li><strong>Sweet Spot:</strong> Do both! Small prepayments + SIP gives best balance</li>
              <li><strong>Tax Benefit:</strong> Loan interest deduction (₹2L) reduces cost further</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
