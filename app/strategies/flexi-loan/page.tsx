"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calculator, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatIndianCompactCurrency } from "@/lib/loan-utils";
import { calculateHomeLoanTaxBenefits, type TaxRegime } from "@/lib/tax-utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function FlexiLoanStrategy() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [savingsRate, setSavingsRate] = useState(4);
  const [monthlyExtra, setMonthlyExtra] = useState(25000);
  const [taxableIncome, setTaxableIncome] = useState(1200000);
  const [regime, setRegime] = useState<TaxRegime>("old");

  const monthlyRate = interestRate / 100 / 12;
  const savingsMonthlyRate = savingsRate / 100 / 12;
  const totalMonths = tenureYears * 12;

  // Calculate standard EMI
  const standardEMI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
                      (Math.pow(1 + monthlyRate, totalMonths) - 1);

  // Flexi loan: Split between loan and savings account
  // Assumption: 50% loanable, 50% in savings account earning interest
  const flexiLoanAmount = loanAmount * 0.5;
  const flexiSavingsAmount = loanAmount * 0.5;

  const flexiEMI = (flexiLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
                   (Math.pow(1 + monthlyRate, totalMonths) - 1);

  // Calculate scenario: standard EMI with extra payment
  let remainingLoanStandard = loanAmount;
  let totalInterestStandard = 0;
  let monthsStandard = 0;

  for (let m = 0; m < totalMonths; m++) {
    if (remainingLoanStandard <= 0) break;

    const interest = remainingLoanStandard * monthlyRate;
    const principal = standardEMI - interest;

    totalInterestStandard += interest;
    remainingLoanStandard -= principal;
    monthsStandard++;

    // Apply extra payment
    if (remainingLoanStandard > 0) {
      remainingLoanStandard = Math.max(0, remainingLoanStandard - monthlyExtra);
    }
  }

  // Flexi loan scenario: EMI on 50% + interest earned on savings
  let remainingLoanFlexi = flexiLoanAmount;
  let savingsBalance = flexiSavingsAmount;
  let totalInterestFlexi = 0;
  let monthsFlexi = 0;

  for (let m = 0; m < totalMonths; m++) {
    if (remainingLoanFlexi <= 0) break;

    // Pay EMI on loan portion
    const interest = remainingLoanFlexi * monthlyRate;
    const principal = flexiEMI - interest;

    totalInterestFlexi += interest;
    remainingLoanFlexi -= principal;
    monthsFlexi++;

    // Earn interest on savings + extra payment
    savingsBalance = savingsBalance * (1 + savingsMonthlyRate) + monthlyExtra;

    // Use savings to reduce loan balance
    if (savingsBalance > 0 && remainingLoanFlexi > 0) {
      const reduceAmount = Math.min(savingsBalance, remainingLoanFlexi);
      remainingLoanFlexi = Math.max(0, remainingLoanFlexi - reduceAmount);
      savingsBalance -= reduceAmount;
    }
  }

  // Interest savings
  const interestSaved = totalInterestStandard - totalInterestFlexi;
  const tenureSaved = monthsStandard - monthsFlexi;

  // Year-by-year data
  const yearData = [];
  let remStandard = loanAmount;
  let remFlexi = flexiLoanAmount;
  let savBalance = flexiSavingsAmount;

  for (let year = 0; year <= tenureYears; year++) {
    for (let month = 0; month < 12; month++) {
      if (remStandard > 0) {
        const interest = remStandard * monthlyRate;
        const principal = standardEMI - interest;
        remStandard -= principal;
        if (remStandard > 0) {
          remStandard = Math.max(0, remStandard - monthlyExtra);
        }
      }

      if (remFlexi > 0) {
        const interest = remFlexi * monthlyRate;
        const principal = flexiEMI - interest;
        remFlexi -= principal;

        savBalance = savBalance * (1 + savingsMonthlyRate) + monthlyExtra;
        if (savBalance > 0 && remFlexi > 0) {
          const reduceAmount = Math.min(savBalance, remFlexi);
          remFlexi = Math.max(0, remFlexi - reduceAmount);
          savBalance -= reduceAmount;
        }
      }
    }

    yearData.push({
      year,
      standardLoan: Math.max(0, Math.round(remStandard)),
      flexiLoan: Math.max(0, Math.round(remFlexi)),
      savings: Math.max(0, Math.round(savBalance))
    });
  }

  // Calculate year 1 principal and interest for tax benefits
  let balance = loanAmount;
  let year1Principal = 0;
  let year1Interest = 0;

  for (let month = 1; month <= 12; month++) {
    const interest = balance * monthlyRate;
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
              Strategy #10: Flexi-Loan
            </h1>
            <p className="text-gray-600 mt-2">
              Split loan: Part EMI, Part savings to offset loan
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
              Flexi-Loan Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label>Home Loan Amount (₹)</Label>
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
                <Label>Savings Account Rate (%)</Label>
                <Input
                  type="number"
                  value={savingsRate}
                  onChange={(e) => setSavingsRate(Number(e.target.value))}
                  step="0.1"
                />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Label>Extra Monthly Payment to Savings (₹)</Label>
              <Input
                type="number"
                value={monthlyExtra}
                onChange={(e) => setMonthlyExtra(Number(e.target.value))}
                step="5000"
                className="mt-2 max-w-xs"
              />
              <p className="text-xs text-gray-500 mt-2">Amount beyond standard EMI to save & use for prepayment</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
              <CardDescription className="text-green-700">Flexi EMI (50% loan)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-700">
                ₹{Math.round(flexiEMI).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-green-600 mt-2">Save ₹{Math.round(standardEMI - flexiEMI).toLocaleString('en-IN')}/month</p>
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
              <CardDescription className="text-purple-700">Tenure Saved</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-700">
                {Math.floor(tenureSaved / 12)} years
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">💰 Tax Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>80C:</span>
                  <span className="font-semibold">₹{taxBenefits.section80c.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between text-xs">
                  <span>24(b):</span>
                  <span className="font-semibold">₹{taxBenefits.section24b.toLocaleString("en-IN")}</span>
                </div>

                <div className="border-t pt-1 flex justify-between">
                  <span className="text-xs font-bold">Annual:</span>
                  <span className="text-xs font-bold text-green-600">
                    ₹{taxBenefits.totalBenefit.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Loan Balance Progression
            </CardTitle>
            <CardDescription>
              Standard loan vs Flexi loan with savings accumulation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={yearData}>
                <defs>
                  <linearGradient id="colorFlexi" x1="0" y1="0" x2="0" y2="1">
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
                  label={{ value: 'Amount', angle: -90, position: 'insideLeft' }}
                  tickFormatter={(value) => formatIndianCompactCurrency(value)}
                />
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="standardLoan"
                  stroke="#ef4444"
                  fill="url(#colorStandard)"
                  name="Standard Loan Balance"
                />
                <Area
                  type="monotone"
                  dataKey="flexiLoan"
                  stroke="#10b981"
                  fill="url(#colorFlexi)"
                  name="Flexi Loan Balance"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">How Flexi-Loan Works</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Dual Structure:</strong> Half amount as traditional home loan, half as savings account</li>
              <li><strong>EMI Only on Loan Portion:</strong> You only pay EMI on 50% amount, 50% in savings</li>
              <li><strong>Savings Account:</strong> Earns interest (4-5%) and can be used anytime</li>
              <li><strong>Offset Mechanism:</strong> Savings automatically offset against loan balance</li>
              <li><strong>Interest Benefit:</strong> Pay interest only on (Loan Balance - Savings Balance)</li>
              <li><strong>Flexibility:</strong> Withdraw savings anytime (though reduces offset benefit)</li>
              <li><strong>Processing:</strong> Takes 30-45 days as it's structured differently</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">💡 Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="text-amber-800">
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Monthly Savings:</strong> Reduce EMI burden by ₹{Math.round(standardEMI - flexiEMI).toLocaleString('en-IN')} vs standard</li>
              <li><strong>Interest Arbitrage:</strong> Pay 8.5% on loan, earn 4% on savings = 4.5% effective cost reduction</li>
              <li><strong>Emergency Fund:</strong> Built-in emergency access to savings without taking personal loan</li>
              <li><strong>Ideal Profile:</strong> Salaried professionals with stable income & ability to save</li>
              <li><strong>Cost Advantage:</strong> Saves ₹{Math.round(interestSaved / 100000)} L in interest over tenure</li>
              <li><strong>Discipline Required:</strong> Must maintain savings discipline; don't withdraw casually</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
