"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calculator, TrendingDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatIndianCompactCurrency } from "@/lib/loan-utils";
import { calculateHomeLoanTaxBenefits, type TaxRegime } from "@/lib/tax-utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function BalanceTransferStrategy() {
  const [currentLoanAmount, setCurrentLoanAmount] = useState(3000000);
  const [currentRate, setCurrentRate] = useState(9.5);
  const [remainingTenure, setRemainingTenure] = useState(15);
  const [newRate, setNewRate] = useState(7.5);
  const [transferCost, setTransferCost] = useState(50000);
  const [taxableIncome, setTaxableIncome] = useState(1200000);
  const [regime, setRegime] = useState<TaxRegime>("old");

  const monthlyRateCurrent = currentRate / 100 / 12;
  const monthlyRateNew = newRate / 100 / 12;
  const totalMonthsCurrent = remainingTenure * 12;

  // Calculate current EMI
  const currentEMI = (currentLoanAmount * monthlyRateCurrent * Math.pow(1 + monthlyRateCurrent, totalMonthsCurrent)) /
                     (Math.pow(1 + monthlyRateCurrent, totalMonthsCurrent) - 1);

  // Calculate new EMI (transfer amount = current loan + cost)
  const transferAmount = currentLoanAmount + transferCost;
  const newEMI = (transferAmount * monthlyRateNew * Math.pow(1 + monthlyRateNew, totalMonthsCurrent)) /
                 (Math.pow(1 + monthlyRateNew, totalMonthsCurrent) - 1);

  // Calculate total cost comparison
  const totalCostCurrent = (currentEMI * totalMonthsCurrent) - currentLoanAmount;
  const totalCostNew = (newEMI * totalMonthsCurrent) - transferAmount;
  const netSavings = totalCostCurrent - totalCostNew - transferCost;

  // Breakeven analysis
  const monthlyEMISavings = currentEMI - newEMI;
  const breakevenMonths = transferCost / monthlyEMISavings;
  const breakevenYears = breakevenMonths / 12;

  // Scenario comparison
  const scenarios = [
    {
      scenario: "Current Loan",
      emi: Math.round(currentEMI),
      totalCost: Math.round(totalCostCurrent),
      savings: 0,
      rate: currentRate
    },
    {
      scenario: "After Transfer",
      emi: Math.round(newEMI),
      totalCost: Math.round(totalCostNew),
      savings: Math.round(netSavings),
      rate: newRate
    }
  ];

  // Year-by-year comparison
  const yearData = [];
  let remCurrent = currentLoanAmount;
  let remNew = transferAmount;
  let cumulativeSavingsCurrent = 0;
  let cumulativeSavingsNew = 0;

  for (let year = 1; year <= remainingTenure; year++) {
    for (let month = 0; month < 12; month++) {
      if (remCurrent > 0) {
        const interest = remCurrent * monthlyRateCurrent;
        const principal = currentEMI - interest;
        cumulativeSavingsCurrent += interest;
        remCurrent -= principal;
      }

      if (remNew > 0) {
        const interest = remNew * monthlyRateNew;
        const principal = newEMI - interest;
        cumulativeSavingsNew += interest;
        remNew -= principal;
      }
    }

    yearData.push({
      year,
      currentLoanRemaining: Math.max(0, Math.round(remCurrent)),
      transferLoanRemaining: Math.max(0, Math.round(remNew))
    });
  }

  // Calculate year 1 principal and interest for tax benefits
  let balance = transferAmount;
  let year1Principal = 0;
  let year1Interest = 0;

  for (let month = 1; month <= 12; month++) {
    const interest = balance * monthlyRateNew;
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
              Strategy #8: Balance Transfer
            </h1>
            <p className="text-gray-600 mt-2">
              Refinance to lower interest rate from another bank
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
              Balance Transfer Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label>Current Loan Amount (₹)</Label>
                <Input
                  type="number"
                  value={currentLoanAmount}
                  onChange={(e) => setCurrentLoanAmount(Number(e.target.value))}
                  step="100000"
                />
              </div>
              <div className="space-y-2">
                <Label>Current Rate (%)</Label>
                <Input
                  type="number"
                  value={currentRate}
                  onChange={(e) => setCurrentRate(Number(e.target.value))}
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label>Remaining Tenure (Years)</Label>
                <Input
                  type="number"
                  value={remainingTenure}
                  onChange={(e) => setRemainingTenure(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>New Rate Offered (%)</Label>
                <Input
                  type="number"
                  value={newRate}
                  onChange={(e) => setNewRate(Number(e.target.value))}
                  step="0.1"
                />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Label>Transfer Costs (₹) - Processing, Legal, etc.</Label>
              <Input
                type="number"
                value={transferCost}
                onChange={(e) => setTransferCost(Number(e.target.value))}
                step="10000"
                className="mt-2 max-w-xs"
              />
              <p className="text-xs text-gray-500 mt-2">Typical: ₹40,000 - ₹100,000</p>
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
              <CardDescription>Current EMI</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₹{Math.round(currentEMI).toLocaleString('en-IN')}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-700">New EMI</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-700">
                ₹{Math.round(newEMI).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-green-600 mt-2">
                Save: ₹{Math.round(currentEMI - newEMI).toLocaleString('en-IN')}/month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-700">Breakeven Period</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-700">
                {Math.round(breakevenMonths)} months
              </p>
              <p className="text-xs text-blue-600 mt-2">
                {Math.round(breakevenYears * 10) / 10} years
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-700">Net Savings (20 years)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-700">
                ₹{Math.round(netSavings).toLocaleString('en-IN')}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Interest - Current</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                ₹{Math.round(totalCostCurrent).toLocaleString('en-IN')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-700">Total Interest - After Transfer</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-700">
                ₹{Math.round(totalCostNew).toLocaleString('en-IN')}
              </p>
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
                  <span className="font-semibold">₹{Math.round(netSavings).toLocaleString("en-IN")}</span>
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
                    ₹{(Math.round(netSavings) + taxBenefits.totalBenefit).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Loan Balance Comparison
            </CardTitle>
            <CardDescription>
              Both loans reduce at similar pace, but with different interest costs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={yearData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis
                  label={{ value: 'Loan Balance', angle: -90, position: 'insideLeft' }}
                  tickFormatter={(value) => formatIndianCompactCurrency(value)}
                />
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                <Legend />
                <Bar dataKey="currentLoanRemaining" fill="#ef4444" name="Current Loan" />
                <Bar dataKey="transferLoanRemaining" fill="#10b981" name="After Transfer" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">How Balance Transfer Works</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>New Bank Takes Over:</strong> New bank pays off old loan completely</li>
              <li><strong>Fresh Loan:</strong> You get new loan at lower rate for remaining tenure</li>
              <li><strong>Costs Involved:</strong> Processing fee (1-1.5%), legal (₹20K-₹40K), valuation (₹5K-₹15K)</li>
              <li><strong>Original Agreement Closed:</strong> Old loan finishes, new terms start</li>
              <li><strong>CIBIL Impact:</strong> Temporarily dips during transfer, recovers in 3-6 months</li>
              <li><strong>Tax Benefits:</strong> Interest deduction continues (Section 24)</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">💡 Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="text-amber-800">
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Rate Difference Matters:</strong> Need at least 0.75% - 1% rate cut to justify transfer</li>
              <li><strong>Breakeven Check:</strong> If breakeven is {Math.round(breakevenYears * 10) / 10} years and tenure is 15 years, transfer saves ₹{Math.round(netSavings / 100000)} L</li>
              <li><strong>Timing:</strong> Earlier in loan, more interest saved (geometric benefit)</li>
              <li><strong>Documentation Heavy:</strong> Get all bank statements, original agreement, NOC</li>
              <li><strong>Hidden Costs:</strong> Property re-valuation, legal drafting, processing fees</li>
              <li><strong>Negotiation Tip:</strong> New bank may waive some fees - always negotiate</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
