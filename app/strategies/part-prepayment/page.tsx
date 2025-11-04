"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calculator, Scale } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatIndianCompactCurrency } from "@/lib/loan-utils";
import { calculateHomeLoanTaxBenefits, type TaxRegime } from "@/lib/tax-utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function PartPrepaymentStrategy() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [prepaymentYear, setPrepaymentYear] = useState(5);
  const [prepaymentAmount, setPrepaymentAmount] = useState(1000000);
  const [taxableIncome, setTaxableIncome] = useState(1200000);
  const [regime, setRegime] = useState<TaxRegime>("old");

  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = tenureYears * 12;

  // Calculate standard EMI
  const standardEMI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
                      (Math.pow(1 + monthlyRate, totalMonths) - 1);

  // Scenario 1: Reduce EMI after prepayment
  let remainingEMI = loanAmount;
  let totalInterestEMI = 0;
  let remainingMonths = totalMonths;

  for (let m = 0; m < totalMonths; m++) {
    if (remainingEMI <= 0) break;

    const interest = remainingEMI * monthlyRate;
    const principal = standardEMI - interest;

    totalInterestEMI += interest;
    remainingEMI -= principal;
    remainingMonths--;

    // Prepayment at specified year
    if (m === prepaymentYear * 12 - 1 && remainingEMI > 0) {
      remainingEMI = Math.max(0, remainingEMI - prepaymentAmount);

      // Recalculate EMI for remaining tenure
      const newMonths = remainingMonths;
      const recalcEMI = (remainingEMI * monthlyRate * Math.pow(1 + monthlyRate, newMonths)) /
                        (Math.pow(1 + monthlyRate, newMonths) - 1);

      // Continue with reduced EMI
      for (let n = m + 1; n < totalMonths; n++) {
        if (remainingEMI <= 0) break;

        const int = remainingEMI * monthlyRate;
        const prin = recalcEMI - int;

        totalInterestEMI += int;
        remainingEMI -= prin;
      }
      break;
    }
  }

  // Scenario 2: Reduce tenure after prepayment
  let remainingTenure = loanAmount;
  let totalInterestTenure = 0;
  let monthsPaidTenure = 0;

  for (let m = 0; m < totalMonths; m++) {
    if (remainingTenure <= 0) break;

    const interest = remainingTenure * monthlyRate;
    const principal = standardEMI - interest;

    totalInterestTenure += interest;
    remainingTenure -= principal;
    monthsPaidTenure++;

    // Prepayment at specified year - then continue with same EMI
    if (m === prepaymentYear * 12 - 1 && remainingTenure > 0) {
      remainingTenure = Math.max(0, remainingTenure - prepaymentAmount);
    }
  }

  // Comparison data
  const comparisonData = [
    {
      scenario: "No Prepayment",
      interest: Math.round((standardEMI * totalMonths) - loanAmount),
      tenure: tenureYears
    },
    {
      scenario: "Reduce EMI",
      interest: Math.round(totalInterestEMI),
      tenure: tenureYears
    },
    {
      scenario: "Reduce Tenure",
      interest: Math.round(totalInterestTenure),
      tenure: Math.round(monthsPaidTenure / 12 * 10) / 10
    }
  ];

  const interestSavedEMI = ((standardEMI * totalMonths) - loanAmount) - totalInterestEMI;
  const interestSavedTenure = ((standardEMI * totalMonths) - loanAmount) - totalInterestTenure;
  const tenureSaved = totalMonths - monthsPaidTenure;

  // Calculate year 1 principal and interest for tax benefits
  const monthlyRateCalc = interestRate / 100 / 12;
  let balance = loanAmount;
  let year1Principal = 0;
  let year1Interest = 0;

  for (let month = 1; month <= 12; month++) {
    const interest = balance * monthlyRateCalc;
    const principal = standardEMI - interest;
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
              Strategy #7: Part Prepayment
            </h1>
            <p className="text-gray-600 mt-2">
              Choose: Reduce EMI vs Reduce Tenure
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
              Prepayment Details
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
                <Label>Prepayment Year</Label>
                <Input
                  type="number"
                  value={prepaymentYear}
                  onChange={(e) => setPrepaymentYear(Number(e.target.value))}
                  min="1"
                  max={tenureYears}
                />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Label>Prepayment Amount (₹)</Label>
              <Input
                type="number"
                value={prepaymentAmount}
                onChange={(e) => setPrepaymentAmount(Number(e.target.value))}
                step="100000"
                className="mt-2 max-w-xs"
              />
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
          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-700">Reduce EMI Option</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-700 mb-3">Interest Saved</p>
              <p className="text-2xl font-bold text-green-700">
                ₹{Math.round(interestSavedEMI).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-green-600 mt-3">EMI stays reduced, tenure same</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-700">Reduce Tenure Option</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-700 mb-3">Time Saved</p>
              <p className="text-2xl font-bold text-blue-700">
                {Math.floor(tenureSaved / 12)} years
              </p>
              <p className="text-xs text-blue-600 mt-3">Interest saved: ₹{Math.round(interestSavedTenure / 100000)} L</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">💰 Total Savings Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Interest Saved:</span>
                  <span className="font-semibold">₹{Math.round(interestSavedTenure).toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Tax Benefits (Annual):</span>
                  <span className="font-semibold text-blue-600">
                    + ₹{taxBenefits.totalBenefit.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-gray-600">
                  <span className="ml-2">└─ Section 80C:</span>
                  <span>₹{taxBenefits.section80c.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between text-xs text-gray-600">
                  <span className="ml-2">└─ Section 24(b):</span>
                  <span>₹{taxBenefits.section24b.toLocaleString("en-IN")}</span>
                </div>

                <div className="border-t pt-2 flex justify-between">
                  <span className="font-bold">Net Benefit:</span>
                  <span className="font-bold text-green-600">
                    ₹{(Math.round(interestSavedTenure) + taxBenefits.totalBenefit).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Strategy Comparison
            </CardTitle>
            <CardDescription>
              Compare total interest paid across different prepayment strategies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="interest" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="interest">Interest Comparison</TabsTrigger>
                <TabsTrigger value="details">Strategy Details</TabsTrigger>
              </TabsList>

              <TabsContent value="interest">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="scenario" />
                    <YAxis
                      label={{ value: 'Total Interest', angle: -90, position: 'insideLeft' }}
                      tickFormatter={(value) => formatIndianCompactCurrency(value)}
                    />
                    <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                    <Bar dataKey="interest" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {comparisonData.map((item, idx) => (
                    <Card key={idx} className="border">
                      <CardHeader className="pb-2">
                        <CardDescription className="font-semibold">{item.scenario}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">Total Interest</p>
                          <p className="text-xl font-bold">₹{item.interest.toLocaleString('en-IN')}</p>
                          <p className="text-sm text-gray-600 pt-2">Tenure</p>
                          <p className="text-lg font-semibold">{item.tenure} years</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Reduce EMI vs Reduce Tenure</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">📉 Reduce EMI Option</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>EMI drops by ₹{Math.round(standardEMI * 0.3).toLocaleString('en-IN')} - ₹{Math.round(standardEMI * 0.5).toLocaleString('en-IN')} (estimate)</li>
                  <li>Better monthly cash flow immediately</li>
                  <li>Loan tenure remains same (20 years)</li>
                  <li>Best if: You need monthly budget relief</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">⏱️ Reduce Tenure Option</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Tenure reduces by {Math.floor(tenureSaved / 12)}-{Math.floor(tenureSaved / 12) + 1} years</li>
                  <li>EMI stays same, but loan ends earlier</li>
                  <li>Significantly more interest saved</li>
                  <li>Best if: You can afford same/higher EMI</li>
                </ul>
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
              <li><strong>Interest Impact:</strong> Reduce Tenure saves more interest (₹{Math.round((interestSavedTenure - interestSavedEMI) / 100000)} L more)</li>
              <li><strong>Cash Flow Impact:</strong> Reduce EMI improves monthly budget for investments/savings</li>
              <li><strong>Flexibility:</strong> Start with Reduce EMI, can always pay extra to shorten tenure later</li>
              <li><strong>Income Dependency:</strong> Use Reduce EMI if income is volatile, Reduce Tenure if stable</li>
              <li><strong>Life Stage:</strong> Reduce Tenure near retirement, Reduce EMI in young earning years</li>
              <li><strong>Hybrid Approach:</strong> Split difference - reduce EMI by 50%, tenure by 50%</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
