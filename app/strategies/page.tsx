"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Lock, TrendingDown, Calculator, IndianRupee } from "lucide-react";
import { formatIndianCompactCurrency } from "@/lib/loan-utils";
import { calculateHomeLoanTaxBenefits, type TaxRegime } from "@/lib/tax-utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface LoanCalculation {
  loanAmount: number;
  interestRate: number;
  tenureYears: number;
  monthlyEMI: number;
  biweeklyPayment: number;
  totalMonthlyInterest: number;
  totalBiweeklyInterest: number;
  totalMonthlySavings: number;
  totalBiweeklySavings: number;
  monthsReduction: number;
  comparisonData: Array<{
    month: number;
    monthlyPrincipal: number;
    biweeklyPrincipal: number;
    monthlySavings: number;
    biweeklySavings: number;
  }>;
}

function calculateBiweeklyStrategy(
  loanAmount: number,
  annualRate: number,
  tenureYears: number
): LoanCalculation {
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = tenureYears * 12;

  // Calculate monthly EMI
  const monthlyEMI =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  // Bi-weekly payment is half of monthly EMI
  const biweeklyPayment = monthlyEMI / 2;

  // Calculate total interest for monthly payments
  let monthlyBalance = loanAmount;
  let monthlyTotalInterest = 0;
  const monthlySchedule = [];

  for (let month = 1; month <= totalMonths; month++) {
    const interest = monthlyBalance * monthlyRate;
    const principal = monthlyEMI - interest;
    monthlyBalance -= principal;
    monthlyTotalInterest += interest;

    if (monthlyBalance < 0) monthlyBalance = 0;

    monthlySchedule.push({
      month,
      balance: monthlyBalance,
      interest,
      principal,
      cumulativeInterest: monthlyTotalInterest,
    });
  }

  // Calculate total interest for bi-weekly payments
  let biweeklyBalance = loanAmount;
  let biweeklyTotalInterest = 0;
  const biweeklySchedule = [];
  let biweeklyMonth = 0;

  // 26 bi-weekly payments per year (52 weeks / 2)
  const totalBiweeklyPayments = Math.ceil((tenureYears * 26 * loanAmount) / (biweeklyPayment * 26));

  for (let payment = 1; payment <= totalBiweeklyPayments; payment++) {
    // Interest for 2 weeks (14 days)
    const biweeklyRate = annualRate / 100 / 26;
    const interest = biweeklyBalance * biweeklyRate;
    const principal = biweeklyPayment - interest;
    biweeklyBalance -= principal;
    biweeklyTotalInterest += interest;

    if (biweeklyBalance <= 0) {
      biweeklyBalance = 0;
      biweeklyMonth = Math.ceil(payment / 2.167); // Approx 26 payments = 12 months
      break;
    }

    if (payment % 2 === 0) {
      const month = Math.floor(payment / 2.167);
      biweeklySchedule.push({
        month,
        balance: biweeklyBalance,
        interest,
        principal,
        cumulativeInterest: biweeklyTotalInterest,
      });
    }
  }

  // Generate comparison data
  const comparisonData = [];
  const maxMonths = Math.max(monthlySchedule.length, biweeklySchedule.length);

  for (let i = 0; i < maxMonths; i += 12) {
    const monthlyData = monthlySchedule[i] || monthlySchedule[monthlySchedule.length - 1];
    const biweeklyData = biweeklySchedule[i] || { balance: 0, cumulativeInterest: biweeklyTotalInterest };

    comparisonData.push({
      month: i,
      monthlyPrincipal: loanAmount - (monthlyData?.balance || 0),
      biweeklyPrincipal: loanAmount - biweeklyData.balance,
      monthlySavings: monthlyTotalInterest,
      biweeklySavings: biweeklyTotalInterest,
    });
  }

  return {
    loanAmount,
    interestRate: annualRate,
    tenureYears,
    monthlyEMI,
    biweeklyPayment,
    totalMonthlyInterest: monthlyTotalInterest,
    totalBiweeklyInterest: biweeklyTotalInterest,
    totalMonthlySavings: monthlyEMI * totalMonths + monthlyTotalInterest,
    totalBiweeklySavings: biweeklyPayment * (biweeklyMonth * 2.167) + biweeklyTotalInterest,
    monthsReduction: totalMonths - biweeklyMonth,
    comparisonData,
  };
}

export default function StrategiesPage() {
  const { data: session } = useSession();
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  // Tax calculation inputs
  const [taxSlab, setTaxSlab] = useState(0.30);
  const [taxableIncome, setTaxableIncome] = useState(1200000);
  const [regime, setRegime] = useState<TaxRegime>("old");

  const calculation = calculateBiweeklyStrategy(loanAmount, interestRate, tenure);
  const savings = calculation.totalMonthlyInterest - calculation.totalBiweeklyInterest;

  // Calculate year 1 principal and interest for tax benefits
  const monthlyRate = interestRate / 100 / 12;
  let balance = loanAmount;
  let year1Principal = 0;
  let year1Interest = 0;

  for (let month = 1; month <= 12; month++) {
    const interest = balance * monthlyRate;
    const principal = calculation.monthlyEMI - interest;
    year1Principal += principal;
    year1Interest += interest;
    balance -= principal;
  }

  // Calculate tax benefits
  const taxBenefits = calculateHomeLoanTaxBenefits(
    year1Principal,
    year1Interest,
    taxableIncome,
    "self-occupied",
    regime
  );

  // Net benefit = Interest saved + Tax benefits
  const netBenefit = savings + taxBenefits.totalBenefit;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <IndianRupee className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Home Loan Toolkit
            </span>
          </Link>
          {session?.user && (
            <Badge variant="secondary" className="px-4 py-2">
              {session.user.name || session.user.email}
            </Badge>
          )}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            Strategy #9:{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bi-Weekly Payment Hack
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pay half your EMI every two weeks instead of full amount monthly. Save ₹3-5 Lakhs in
            interest!
          </p>
          <Badge className="mt-4 bg-green-600 text-white text-lg px-6 py-2">
            FREE Strategy - Try Now!
          </Badge>
        </div>

        {/* Rationale & Execution */}
        <Card className="mb-6 border-l-4 border-l-blue-600">
          <CardHeader>
            <CardTitle className="text-lg">📘 Why This Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Instead of paying ₹50,000 EMI monthly (12 payments/year = ₹6L), you pay ₹25,000 every 2 weeks (26 payments/year = ₹6.5L). That extra ₹50k goes directly to principal, not interest! It's painless because you're paid bi-weekly anyway. Over 20 years, this "trick" can save 3-5 years and ₹8-12 lakhs in interest.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-900">📋 How to Execute:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Check if your bank accepts bi-weekly EMI (most do via standing instruction)</li>
                <li>Calculate bi-weekly amount: Monthly EMI ÷ 2 (₹50,000 → ₹25,000)</li>
                <li>Set up auto-debit on 1st and 15th of every month (or your pay dates)</li>
                <li>CRITICAL: Ensure it's credited as EMI payment, not random deposit</li>
                <li>Some banks call it "fortnightly EMI" - same concept</li>
                <li>If bank doesn't support auto bi-weekly, manually prepay ₹25k monthly</li>
                <li>Track annual prepayment: You're making 13 months of EMI in 12 months!</li>
                <li>Review loan statement quarterly to verify principal reduction</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Calculator Inputs */}
        <Card className="p-8 mb-8 shadow-xl">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="loanAmount" className="text-lg font-semibold">
                Loan Amount (₹)
              </Label>
              <Input
                id="loanAmount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="text-lg h-12"
              />
              <p className="text-sm text-gray-600">
                ₹{loanAmount.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate" className="text-lg font-semibold">
                Interest Rate (% p.a.)
              </Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="text-lg h-12"
              />
              <p className="text-sm text-gray-600">{interestRate}% per year</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tenure" className="text-lg font-semibold">
                Loan Tenure (Years)
              </Label>
              <Input
                id="tenure"
                type="number"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="text-lg h-12"
              />
              <p className="text-sm text-gray-600">{tenure} years</p>
            </div>
          </div>

          {/* Tax Calculation Inputs */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Tax Benefits (Year 1)</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="taxableIncome" className="text-sm font-medium">
                  Annual Taxable Income (₹)
                </Label>
                <Input
                  id="taxableIncome"
                  type="number"
                  value={taxableIncome}
                  onChange={(e) => setTaxableIncome(Number(e.target.value))}
                  className="h-10"
                />
                <p className="text-xs text-gray-500">
                  ₹{taxableIncome.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Tax Regime</Label>
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

              <div className="space-y-2">
                <Label htmlFor="taxSlab" className="text-sm font-medium">
                  Your Tax Slab
                </Label>
                <Select value={taxSlab.toString()} onValueChange={(value) => setTaxSlab(Number(value))}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0% (No tax)</SelectItem>
                    <SelectItem value="0.05">5% (₹3-6L income)</SelectItem>
                    <SelectItem value="0.20">20% (₹6-12L income)</SelectItem>
                    <SelectItem value="0.30">30% (Above ₹12L)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* Results Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Monthly EMI</h3>
            <p className="text-3xl font-bold text-blue-600">
              ₹{Math.round(calculation.monthlyEMI).toLocaleString("en-IN")}
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Bi-Weekly Payment</h3>
            <p className="text-3xl font-bold text-purple-600">
              ₹{Math.round(calculation.biweeklyPayment).toLocaleString("en-IN")}
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Interest Saved</h3>
            <p className="text-3xl font-bold text-green-600">
              ₹{Math.round(savings).toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-gray-600 mt-1">Over loan lifetime</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Time Saved</h3>
            <p className="text-3xl font-bold text-orange-600">
              {Math.round(calculation.monthsReduction)} months
            </p>
          </Card>
        </div>

        {/* Tax Benefits Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Tax Benefits (Year 1)</h3>
            <p className="text-3xl font-bold text-amber-600">
              ₹{Math.round(taxBenefits.totalBenefit).toLocaleString("en-IN")}
            </p>
            <div className="text-xs text-gray-600 mt-2 space-y-1">
              <p>80C: ₹{Math.round(taxBenefits.section80c).toLocaleString("en-IN")}</p>
              <p>24B: ₹{Math.round(taxBenefits.section24b).toLocaleString("en-IN")}</p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-300">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">NET Benefit (Year 1)</h3>
            <p className="text-3xl font-bold text-emerald-600">
              ₹{Math.round(netBenefit).toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-gray-600 mt-1">Interest saved + Tax benefits</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-cyan-50 to-cyan-100">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Year 1 Breakdown</h3>
            <div className="text-sm space-y-1 mt-2">
              <p className="text-gray-700">Principal: ₹{Math.round(year1Principal).toLocaleString("en-IN")}</p>
              <p className="text-gray-700">Interest: ₹{Math.round(year1Interest).toLocaleString("en-IN")}</p>
              <p className="text-xs text-gray-500 mt-1">{regime === "old" ? "Old Regime" : "New Regime"}</p>
            </div>
          </Card>
        </div>

        {/* Visualization Tabs */}
        <Card className="p-8 shadow-xl">
          <Tabs defaultValue="principal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="principal">Principal Repayment</TabsTrigger>
              <TabsTrigger value="interest">Interest Comparison</TabsTrigger>
              <TabsTrigger value="savings">Cumulative Savings</TabsTrigger>
            </TabsList>

            <TabsContent value="principal" className="space-y-4">
              <h3 className="text-2xl font-bold text-center">Principal Repayment Over Time</h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={calculation.comparisonData}>
                  <defs>
                    <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorBiweekly" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" label={{ value: "Months", position: "insideBottom", offset: -5 }} />
                  <YAxis
                    label={{ value: "Principal Paid", angle: -90, position: "insideLeft" }}
                    tickFormatter={(value) => formatIndianCompactCurrency(value)}
                  />
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="monthlyPrincipal"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorMonthly)"
                    name="Monthly Payments"
                  />
                  <Area
                    type="monotone"
                    dataKey="biweeklyPrincipal"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorBiweekly)"
                    name="Bi-Weekly Payments"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="interest" className="space-y-4">
              <h3 className="text-2xl font-bold text-center">Interest Paid Comparison</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={[
                    {
                      type: "Monthly",
                      interest: calculation.totalMonthlyInterest,
                    },
                    {
                      type: "Bi-Weekly",
                      interest: calculation.totalBiweeklyInterest,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis
                    label={{ value: "Total Interest", angle: -90, position: "insideLeft" }}
                    tickFormatter={(value) => formatIndianCompactCurrency(value)}
                  />
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`} />
                  <Bar dataKey="interest" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
              <div className="text-center text-2xl font-bold text-green-600">
                You save ₹{Math.round(savings).toLocaleString("en-IN")} in interest!
              </div>
            </TabsContent>

            <TabsContent value="savings" className="space-y-4">
              <h3 className="text-2xl font-bold text-center">Your Savings Growth</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={calculation.comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" label={{ value: "Months", position: "insideBottom", offset: -5 }} />
                  <YAxis
                    label={{ value: "Savings", angle: -90, position: "insideLeft" }}
                    tickFormatter={(value) => formatIndianCompactCurrency(value)}
                  />
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="monthlySavings"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    name="Without Strategy"
                  />
                  <Line
                    type="monotone"
                    dataKey="biweeklySavings"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="With Bi-Weekly"
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </Card>

        {/* How It Works */}
        <Card className="p-8 mt-8">
          <h2 className="text-3xl font-bold mb-6">How the Bi-Weekly Strategy Works</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Traditional Monthly Payment</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Pay EMI once a month (12 payments/year)</li>
                <li>✓ Interest calculated on full monthly balance</li>
                <li>✓ Takes full {tenure} years to repay</li>
                <li>✗ Total interest: ₹{Math.round(calculation.totalMonthlyInterest).toLocaleString("en-IN")}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-purple-600">Bi-Weekly Strategy</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Pay half EMI every 2 weeks (26 payments/year)</li>
                <li>✓ Reduces principal faster, less interest compounds</li>
                <li>✓ Finishes {Math.round(calculation.monthsReduction)} months earlier!</li>
                <li>✓ Total interest: ₹{Math.round(calculation.totalBiweeklyInterest).toLocaleString("en-IN")}</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Premium Strategies CTA */}
        <Card className="p-12 mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
          <Lock className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-4xl font-bold mb-4">Want 11 More Strategies?</h2>
          <p className="text-xl mb-6 opacity-90">
            Unlock strategies to save ₹8-25 Lakhs more with advanced techniques
          </p>
          <Link href="/checkout">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get All 12 Strategies for ₹99
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
