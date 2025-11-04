"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calculator, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatIndianCompactCurrency } from "@/lib/loan-utils";
import { calculateHomeLoanTaxBenefits, type TaxRegime } from "@/lib/tax-utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function TopUpStrategy() {
  const [originalLoan, setOriginalLoan] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [topUpAmount, setTopUpAmount] = useState(1500000);
  const [loanAgeYears, setLoanAgeYears] = useState(3);
  const [taxableIncome, setTaxableIncome] = useState(1200000);
  const [regime, setRegime] = useState<TaxRegime>("old");

  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = tenureYears * 12;
  const elapsedMonths = loanAgeYears * 12;

  // Calculate original EMI
  const originalEMI = (originalLoan * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
                      (Math.pow(1 + monthlyRate, totalMonths) - 1);

  // Calculate remaining balance after loan age years
  let remainingBalance = originalLoan;
  for (let m = 0; m < elapsedMonths; m++) {
    const interest = remainingBalance * monthlyRate;
    const principal = originalEMI - interest;
    remainingBalance -= principal;
  }

  // After top-up: new loan = remaining balance + top-up amount
  const newLoanAmount = Math.max(0, remainingBalance) + topUpAmount;
  const remainingTenure = tenureYears - loanAgeYears;
  const remainingMonths = remainingTenure * 12;

  // Calculate new EMI
  const newEMI = remainingMonths > 0
    ? (newLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) /
      (Math.pow(1 + monthlyRate, remainingMonths) - 1)
    : 0;

  // Calculate interest scenarios
  const totalInterestWithoutTopUp = (originalEMI * totalMonths) - originalLoan;

  // Interest for remaining period without top-up
  let interestWithoutTopUp = 0;
  let tempBalance = remainingBalance;
  for (let m = 0; m < remainingMonths; m++) {
    const interest = tempBalance * monthlyRate;
    interestWithoutTopUp += interest;
    const principal = originalEMI - interest;
    tempBalance -= principal;
  }

  // Interest with top-up
  let interestWithTopUp = 0;
  tempBalance = newLoanAmount;
  for (let m = 0; m < remainingMonths; m++) {
    const interest = tempBalance * monthlyRate;
    interestWithTopUp += interest;
    const principal = newEMI - interest;
    tempBalance -= principal;
  }

  // Total interest comparison
  const totalInterestWithoutTopUpFull = (originalEMI * elapsedMonths) + interestWithoutTopUp;
  const totalInterestWithTopUpFull = (originalEMI * elapsedMonths) + interestWithTopUp;

  // Year-by-year visualization
  const yearData = [];
  let balanceNoTopUp = remainingBalance;
  let balanceWithTopUp = newLoanAmount;

  for (let year = loanAgeYears; year <= tenureYears; year++) {
    for (let month = 0; month < 12 && year * 12 + month <= totalMonths; month++) {
      if (balanceNoTopUp > 0) {
        const interest = balanceNoTopUp * monthlyRate;
        const principal = originalEMI - interest;
        balanceNoTopUp -= principal;
      }

      if (balanceWithTopUp > 0) {
        const interest = balanceWithTopUp * monthlyRate;
        const principal = newEMI - interest;
        balanceWithTopUp -= principal;
      }
    }

    if ((year - loanAgeYears) % 1 === 0) {
      yearData.push({
        year,
        withoutTopUp: Math.max(0, Math.round(balanceNoTopUp)),
        withTopUp: Math.max(0, Math.round(balanceWithTopUp))
      });
    }
  }

  const addedInterest = totalInterestWithTopUpFull - totalInterestWithoutTopUpFull;

  // Calculate year 1 principal and interest for tax benefits
  let balance = newLoanAmount;
  let year1Principal = 0;
  let year1Interest = 0;

  for (let month = 1; month <= 12; month++) {
    const interest = balance * monthlyRate;
    const principal = newEMI - interest;
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
              Strategy #9: Top-Up Loan
            </h1>
            <p className="text-gray-600 mt-2">
              Borrow additional funds on existing home loan
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
              Top-Up Loan Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label>Original Loan Amount (₹)</Label>
                <Input
                  type="number"
                  value={originalLoan}
                  onChange={(e) => setOriginalLoan(Number(e.target.value))}
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
                <Label>Original Tenure (Years)</Label>
                <Input
                  type="number"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Current Loan Age (Years)</Label>
                <Input
                  type="number"
                  value={loanAgeYears}
                  onChange={(e) => setLoanAgeYears(Number(e.target.value))}
                  min="1"
                  max={tenureYears - 1}
                />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Label>Top-Up Amount (₹)</Label>
              <Input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(Number(e.target.value))}
                step="100000"
                className="mt-2 max-w-xs"
              />
              <p className="text-xs text-gray-500 mt-2">Usually up to 50% of current property value</p>
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
              <CardDescription>Original EMI</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₹{Math.round(originalEMI).toLocaleString('en-IN')}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-red-700">New EMI (After Top-Up)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-700">
                ₹{Math.round(newEMI).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-red-600 mt-2">
                Increase: ₹{Math.round(newEMI - originalEMI).toLocaleString('en-IN')}/month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-700">Remaining Tenure</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-700">
                {remainingTenure} years
              </p>
              <p className="text-xs text-blue-600 mt-2">Same tenure as original loan</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-700">Additional Interest Cost</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-700">
                ₹{Math.round(addedInterest).toLocaleString('en-IN')}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Loan Balance Over Time
            </CardTitle>
            <CardDescription>
              Comparison: With vs Without top-up
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
                  dataKey="withoutTopUp"
                  stroke="#ef4444"
                  name="Without Top-Up"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="withTopUp"
                  stroke="#3b82f6"
                  name="With Top-Up"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-sm">Remaining Balance Today</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">₹{Math.round(remainingBalance).toLocaleString('en-IN')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-sm">Top-Up Amount</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">₹{topUpAmount.toLocaleString('en-IN')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-sm">New Total Loan</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">₹{Math.round(newLoanAmount).toLocaleString('en-IN')}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">💰 Tax Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Section 80C:</span>
                  <span className="font-semibold">₹{taxBenefits.section80c.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between text-xs">
                  <span>Section 24(b):</span>
                  <span className="font-semibold">₹{taxBenefits.section24b.toLocaleString("en-IN")}</span>
                </div>

                <div className="border-t pt-1 flex justify-between">
                  <span className="text-xs font-bold">Annual Benefit:</span>
                  <span className="text-xs font-bold text-green-600">
                    ₹{taxBenefits.totalBenefit.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">How Top-Up Loan Works</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Eligibility:</strong> 3-5 years into existing home loan with good repayment</li>
              <li><strong>Approval Basis:</strong> Based on home value appreciation & equity built</li>
              <li><strong>Amount:</strong> Usually 50% of current property value - (remaining loan balance)</li>
              <li><strong>Interest Rate:</strong> Same as original loan or slightly higher (0.25-0.5%)</li>
              <li><strong>Tenure:</strong> Extended to original tenure end, not new tenure</li>
              <li><strong>Use Case:</strong> Home renovation, education, marriage, business needs</li>
              <li><strong>EMI Impact:</strong> Increases proportional to borrowed amount</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">💡 Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="text-amber-800">
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Cost of Top-Up:</strong> You'll pay ₹{Math.round(addedInterest / 100000)} L extra interest over {remainingTenure} years</li>
              <li><strong>Best Uses:</strong> Property renovation (adds value), education (long-term ROI), not consumption</li>
              <li><strong>Interest Rate Advantage:</strong> Home loan rates (7-8.5%) cheaper than personal loans (12-15%)</li>
              <li><strong>Tax Benefit:</strong> Interest deductible if used for property improvement or income generation</li>
              <li><strong>Approval Timeline:</strong> 15-20 days vs 45-60 days for fresh loan</li>
              <li><strong>Documentation:</strong> Minimal - no property re-registration needed</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
