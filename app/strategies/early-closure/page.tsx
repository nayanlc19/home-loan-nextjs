"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calculator, TrendingDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EarlyClosureStrategy() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [loanAgeYears, setLoanAgeYears] = useState(8);
  const [investmentReturns, setInvestmentReturns] = useState(12);

  const monthlyRate = interestRate / 100 / 12;
  const monthlyInvRate = investmentReturns / 100 / 12;
  const totalMonths = tenureYears * 12;
  const elapsedMonths = loanAgeYears * 12;
  const remainingMonths = totalMonths - elapsedMonths;

  // Calculate standard EMI
  const standardEMI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
                      (Math.pow(1 + monthlyRate, totalMonths) - 1);

  // Calculate remaining balance after loan age years
  let remainingBalance = loanAmount;
  let totalInterestPaid = 0;

  for (let m = 0; m < elapsedMonths; m++) {
    const interest = remainingBalance * monthlyRate;
    const principal = standardEMI - interest;
    totalInterestPaid += interest;
    remainingBalance -= principal;
  }

  // Scenario 1: Early closure - pay remaining balance now
  const earlyClosureCost = remainingBalance;

  // Future interest if NOT closed
  let futureInterestIfContinue = 0;
  let tempBalance = remainingBalance;
  for (let m = 0; m < remainingMonths; m++) {
    const interest = tempBalance * monthlyRate;
    futureInterestIfContinue += interest;
    const principal = standardEMI - interest;
    tempBalance -= principal;
  }

  // Scenario 2: Continue paying EMI, invest difference
  const futureValueInvestment = standardEMI * 12 * monthlyInvRate * remainingMonths;

  // Proper compound calculation for lump sum investment
  let investmentValue = 0;
  for (let month = 0; month < remainingMonths; month++) {
    investmentValue = investmentValue * (1 + monthlyInvRate) + standardEMI;
  }

  // Scenario 3: Close early AND invest the saved EMI amount
  let investmentValueEarlyClose = 0;
  for (let month = 0; month < remainingMonths; month++) {
    investmentValueEarlyClose = investmentValueEarlyClose * (1 + monthlyInvRate) + standardEMI;
  }

  // Comparison at end of 20 years
  // Close early: No future interest but lose investment growth opportunity
  // Continue: Pay future interest but build investment corpus
  const netPositionContinue = investmentValue - futureInterestIfContinue;
  const netPositionEarlyClose = investmentValueEarlyClose; // No interest to pay
  const betterOption = netPositionEarlyClose > netPositionContinue ? "Early Close" : "Continue Paying";
  const difference = Math.abs(netPositionEarlyClose - netPositionContinue);

  // Scenario breakdown
  const scenarios = [
    {
      scenario: "Early Closure",
      immediateOutlay: Math.round(earlyClosureCost),
      investmentBuilt: Math.round(investmentValueEarlyClose),
      interestPaid: Math.round(totalInterestPaid),
      futureInterest: 0,
      netWealth: Math.round(investmentValueEarlyClose - totalInterestPaid)
    },
    {
      scenario: "Continue Paying",
      immediateOutlay: 0,
      investmentBuilt: Math.round(investmentValue),
      interestPaid: Math.round(totalInterestPaid + futureInterestIfContinue),
      futureInterest: Math.round(futureInterestIfContinue),
      netWealth: Math.round(investmentValue - (totalInterestPaid + futureInterestIfContinue))
    }
  ];

  // Year-by-year breakdown for remaining tenure
  const yearData = [];
  let balanceIfContinue = remainingBalance;
  let investmentIfEarlyClose = 0;
  let investmentIfContinue = 0;

  for (let year = loanAgeYears; year <= tenureYears; year++) {
    for (let month = 0; month < 12 && year * 12 + month <= totalMonths; month++) {
      // If continuing
      if (balanceIfContinue > 0) {
        const interest = balanceIfContinue * monthlyRate;
        const principal = standardEMI - interest;
        balanceIfContinue -= principal;
      }

      // Investment if early close
      investmentIfEarlyClose = investmentIfEarlyClose * (1 + monthlyInvRate) + standardEMI;

      // Investment if continue (pay EMI + invest nothing extra)
      investmentIfContinue = investmentIfContinue * (1 + monthlyInvRate);
    }

    yearData.push({
      year,
      continueBalance: Math.max(0, Math.round(balanceIfContinue)),
      investmentEarlyClose: Math.round(investmentIfEarlyClose),
      investmentContinue: Math.round(investmentIfContinue)
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Strategy #12: Early Closure vs Investment
            </h1>
            <p className="text-gray-600 mt-2">
              Should you close loan early or invest the money?
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
              Loan & Investment Parameters
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
              <Label>Expected Investment Returns (%/year)</Label>
              <Input
                type="number"
                value={investmentReturns}
                onChange={(e) => setInvestmentReturns(Number(e.target.value))}
                step="0.5"
                className="mt-2 max-w-xs"
              />
              <p className="text-xs text-gray-500 mt-2">Equity returns: 10-14%, Debt: 6-7%, Balanced: 9-12%</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Monthly EMI</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₹{Math.round(standardEMI).toLocaleString('en-IN')}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-red-700">Current Outstanding</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-700">
                ₹{Math.round(remainingBalance).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-red-600 mt-2">After {loanAgeYears} years</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-700">Future Interest (If Continue)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-700">
                ₹{Math.round(futureInterestIfContinue).toLocaleString('en-IN')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-700">Better Option</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-700">
                {betterOption}
              </p>
              <p className="text-xs text-green-600 mt-2">
                By ₹{Math.round(difference / 100000)} L
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Strategy Comparison
            </CardTitle>
            <CardDescription>
              Investment corpus built: Early Closure vs Continue Paying
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={yearData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                <Legend />
                <Bar dataKey="investmentEarlyClose" fill="#10b981" name="Investment (Early Close)" />
                <Bar dataKey="continueBalance" fill="#ef4444" name="Loan Balance (Continue)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Early Closure Option</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Immediate Outlay</span>
                <span className="font-semibold">₹{Math.round(earlyClosureCost).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Investment Built</span>
                <span className="font-semibold text-green-600">₹{scenarios[0].investmentBuilt.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Interest Paid</span>
                <span className="font-semibold">₹{scenarios[0].interestPaid.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Future Interest</span>
                <span className="font-semibold text-green-600">₹0</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Net Wealth at Year 20</span>
                <span className="text-green-700">₹{scenarios[0].netWealth.toLocaleString('en-IN')}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Continue Paying Option</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Immediate Outlay</span>
                <span className="font-semibold">₹0</span>
              </div>
              <div className="flex justify-between">
                <span>Investment Built</span>
                <span className="font-semibold text-blue-600">₹{scenarios[1].investmentBuilt.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Interest Paid</span>
                <span className="font-semibold">₹{scenarios[1].interestPaid.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Future Interest</span>
                <span className="font-semibold text-red-600">₹{scenarios[1].futureInterest.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Net Wealth at Year 20</span>
                <span className="text-blue-700">₹{scenarios[1].netWealth.toLocaleString('en-IN')}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Decision Framework</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">📊 Early Closure is Better When:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Investment returns are lower than interest rate ({interestRate}%)</li>
                  <li>You want guaranteed risk-free savings (guaranteed {interestRate}% return)</li>
                  <li>You're risk-averse; prefer peace of mind over growth</li>
                  <li>You need to reduce monthly financial obligations</li>
                  <li>Job security is uncertain; want debt-free status</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📈 Continuing Paying is Better When:</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Investment returns ({investmentReturns}%) > Interest rate ({interestRate}%)</li>
                  <li>You're comfortable with market fluctuations</li>
                  <li>You want to build wealth faster through compounding</li>
                  <li>You get tax benefits on interest deduction</li>
                  <li>You prefer liquidity to offset loan</li>
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
              <li><strong>The Math:</strong> If investment returns ({investmentReturns}%) > loan rate ({interestRate}%), keep the loan</li>
              <li><strong>Difference:</strong> {Math.round(difference / 100000)} L difference between two strategies over {tenureYears - loanAgeYears} years!</li>
              <li><strong>Tax Factor:</strong> Interest is tax-deductible (Section 24) - this reduces effective cost</li>
              <li><strong>Liquidity Edge:</strong> Continuing gives you accessible corpus; early closure removes flexibility</li>
              <li><strong>Inflation Benefit:</strong> EMI fixed; rupee depreciates; effectively paying less in real terms</li>
              <li><strong>Hybrid Approach:</strong> Pay extra + invest = best of both worlds (reduces loan, builds corpus)</li>
              <li><strong>Psychological Factor:</strong> Debt-free lifestyle vs wealth building - personal choice matters</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
