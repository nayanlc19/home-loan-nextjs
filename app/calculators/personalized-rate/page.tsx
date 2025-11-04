"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  calculatePersonalizedRate,
  getRateImprovementTips,
  type UserProfile,
  type CreditScoreBand,
  type Gender,
  type EmploymentType,
  type Location,
} from "@/lib/rate-utils";
import { ArrowLeft, TrendingDown, TrendingUp, Minus } from "lucide-react";

const banks = [
  { name: "PNB", baseRate: 8.40 },
  { name: "SBI", baseRate: 8.50 },
  { name: "HDFC", baseRate: 8.60 },
  { name: "Axis", baseRate: 8.65 },
  { name: "Kotak", baseRate: 8.70 },
  { name: "ICICI", baseRate: 8.75 },
];

export default function PersonalizedRateCalculator() {
  const [creditScore, setCreditScore] = useState<CreditScoreBand>("750+");
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<Gender>("male");
  const [employment, setEmployment] = useState<EmploymentType>("salaried-other");
  const [loanAmount, setLoanAmount] = useState<number>(5000000);
  const [location, setLocation] = useState<Location>("metro-tier1");

  const userProfile: UserProfile = {
    creditScore,
    age,
    gender,
    employment,
    loanAmount,
    location,
  };

  // Calculate personalized rates for all banks
  const bankResults = useMemo(() => {
    return banks.map((bank) => {
      const result = calculatePersonalizedRate(bank.baseRate, userProfile);
      return {
        ...bank,
        ...result,
      };
    });
  }, [userProfile]);

  // Find best and worst rates
  const bestRate = Math.min(...bankResults.map((b) => b.adjustedRate));
  const worstRate = Math.max(...bankResults.map((b) => b.adjustedRate));

  // Calculate interest saved over 20 years
  const calculateInterestSaved = (rate: number) => {
    const principal = loanAmount;
    const tenure = 20 * 12; // 20 years in months

    // EMI calculation for this rate
    const monthlyRate = rate / (12 * 100);
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
    const totalPayment = emi * tenure;
    const interest = totalPayment - principal;

    // EMI calculation for worst rate
    const worstMonthlyRate = worstRate / (12 * 100);
    const worstEmi = (principal * worstMonthlyRate * Math.pow(1 + worstMonthlyRate, tenure)) / (Math.pow(1 + worstMonthlyRate, tenure) - 1);
    const worstTotalPayment = worstEmi * tenure;
    const worstInterest = worstTotalPayment - principal;

    return worstInterest - interest;
  };

  // Get improvement tips
  const tips = getRateImprovementTips(userProfile);

  // Get adjustment breakdown from first bank (same for all banks)
  const adjustmentBreakdown = bankResults[0]?.adjustments || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎯 Find Your Perfect Home Loan Rate
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            See exactly what rate YOU qualify for based on YOUR profile
          </p>
          <p className="text-sm text-blue-600 font-medium">
            Banks look at 6 factors. Optimize them to get the best rate!
          </p>
        </div>

        {/* Input Form */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Adjust these factors to see your personalized rates from top banks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Credit Score */}
              <div className="space-y-2">
                <Label htmlFor="credit-score">Credit Score</Label>
                <Select value={creditScore} onValueChange={(v) => setCreditScore(v as CreditScoreBand)}>
                  <SelectTrigger id="credit-score">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="750+">750+ (Excellent)</SelectItem>
                    <SelectItem value="700-749">700-749 (Good)</SelectItem>
                    <SelectItem value="650-699">650-699 (Fair)</SelectItem>
                    <SelectItem value="<650">&lt;650 (Poor)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Higher score = better rate</p>
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age">Age: {age} years</Label>
                <Slider
                  id="age"
                  min={23}
                  max={62}
                  step={1}
                  value={[age]}
                  onValueChange={(v) => setAge(v[0])}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500">25-35 years get best rates</p>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={(v) => setGender(v as Gender)}>
                  <SelectTrigger id="gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Women get 0.05% concession</p>
              </div>

              {/* Employment */}
              <div className="space-y-2">
                <Label htmlFor="employment">Employment Type</Label>
                <Select value={employment} onValueChange={(v) => setEmployment(v as EmploymentType)}>
                  <SelectTrigger id="employment">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salaried-govt">Government Employee</SelectItem>
                    <SelectItem value="salaried-mnc">MNC Employee</SelectItem>
                    <SelectItem value="salaried-other">Private Sector</SelectItem>
                    <SelectItem value="self-employed">Self-Employed</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Govt/MNC employees get lower rates</p>
              </div>

              {/* Loan Amount */}
              <div className="space-y-2">
                <Label htmlFor="loan-amount">Loan Amount (₹)</Label>
                <Input
                  id="loan-amount"
                  type="number"
                  min={100000}
                  max={100000000}
                  step={100000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                />
                <p className="text-xs text-gray-500">
                  ₹{(loanAmount / 100000).toFixed(2)} lakhs • Higher loans get better rates
                </p>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Property Location</Label>
                <Select value={location} onValueChange={(v) => setLocation(v as Location)}>
                  <SelectTrigger id="location">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metro-tier1">Metro / Tier-1 City</SelectItem>
                    <SelectItem value="tier2">Tier-2 City</SelectItem>
                    <SelectItem value="tier3">Tier-3 City</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Metro cities get best rates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Comparison Table */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle>Your Personalized Rates Across Banks</CardTitle>
            <CardDescription>
              Based on your profile, here&apos;s what each bank would offer you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bank</TableHead>
                    <TableHead className="text-right">Base Rate</TableHead>
                    <TableHead className="text-right">Your Rate</TableHead>
                    <TableHead className="text-right">Adjustment</TableHead>
                    <TableHead className="text-right">Interest Saved (20 years)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bankResults.map((bank) => {
                    const interestSaved = calculateInterestSaved(bank.adjustedRate);
                    const isBest = bank.adjustedRate === bestRate;

                    return (
                      <TableRow key={bank.name} className={isBest ? "bg-green-50" : ""}>
                        <TableCell className="font-medium">
                          {bank.name}
                          {isBest && (
                            <Badge className="ml-2 bg-green-600">Best Rate</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">{bank.baseRate.toFixed(2)}%</TableCell>
                        <TableCell className="text-right font-bold text-lg">
                          {bank.adjustedRate.toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`font-medium flex items-center justify-end ${
                              bank.totalAdjustment < 0
                                ? "text-green-600"
                                : bank.totalAdjustment > 0
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            {bank.totalAdjustment < 0 ? (
                              <TrendingDown className="h-4 w-4 mr-1" />
                            ) : bank.totalAdjustment > 0 ? (
                              <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                              <Minus className="h-4 w-4 mr-1" />
                            )}
                            {bank.totalAdjustment > 0 ? "+" : ""}
                            {bank.totalAdjustment.toFixed(2)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {interestSaved > 0 ? (
                            <span className="text-green-600 font-medium">
                              ₹{(interestSaved / 100000).toFixed(2)} lakhs
                            </span>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Adjustment Breakdown */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Rate Adjustment Breakdown</CardTitle>
              <CardDescription>
                How each factor affects your interest rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adjustmentBreakdown.map((adj, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 ${
                      adj.adjustment < 0
                        ? "border-green-200 bg-green-50"
                        : adj.adjustment > 0
                        ? "border-red-200 bg-red-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{adj.factor}</h4>
                      <span
                        className={`font-bold text-lg ${
                          adj.adjustment < 0
                            ? "text-green-600"
                            : adj.adjustment > 0
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {adj.adjustment > 0 ? "+" : ""}
                        {adj.adjustment.toFixed(2)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{adj.description}</p>
                  </div>
                ))}

                {/* Total */}
                <div className="pt-4 border-t-2 border-gray-300">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-lg text-gray-900">Total Adjustment</h4>
                    <span
                      className={`font-bold text-2xl ${
                        bankResults[0].totalAdjustment < 0
                          ? "text-green-600"
                          : bankResults[0].totalAdjustment > 0
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {bankResults[0].totalAdjustment > 0 ? "+" : ""}
                      {bankResults[0].totalAdjustment.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rate Improvement Tips */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Rate Improvement Tips</CardTitle>
              <CardDescription>
                How to get an even better rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tips.length > 0 ? (
                <div className="space-y-3">
                  {tips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded"
                    >
                      <p className="text-sm text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg text-center">
                  <p className="text-lg font-semibold text-green-700 mb-2">
                    🎉 Excellent Profile!
                  </p>
                  <p className="text-sm text-gray-600">
                    You already have an optimal profile. You&apos;re getting the best possible rates across all factors!
                  </p>
                </div>
              )}

              {/* Always show these general tips */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <h5 className="font-semibold text-gray-900 mb-3">General Tips:</h5>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-700">
                    💬 <strong>Negotiate:</strong> Use these rates to negotiate with your bank. Show them competitor offers.
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-700">
                    📊 <strong>Compare Total Cost:</strong> A 0.1% difference over 20 years can save lakhs. Always compare!
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-700">
                    🏦 <strong>Existing Customer:</strong> If you have a salary account or relationship with a bank, ask for a loyalty discount.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <Card className="mt-8 shadow-lg border-2 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Your Best Rate: {bestRate.toFixed(2)}%
              </h3>
              <p className="text-gray-600 mb-4">
                with {bankResults.find(b => b.adjustedRate === bestRate)?.name}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-sm text-gray-600 mb-1">Loan Amount</p>
                  <p className="text-xl font-bold text-gray-900">
                    ₹{(loanAmount / 100000).toFixed(2)} L
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-sm text-gray-600 mb-1">Best Monthly EMI (20yr)</p>
                  <p className="text-xl font-bold text-green-600">
                    ₹
                    {(() => {
                      const rate = bestRate / (12 * 100);
                      const tenure = 20 * 12;
                      const emi = (loanAmount * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
                      return Math.round(emi).toLocaleString("en-IN");
                    })()}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-sm text-gray-600 mb-1">Potential Savings</p>
                  <p className="text-xl font-bold text-green-600">
                    ₹{(calculateInterestSaved(bestRate) / 100000).toFixed(2)} L
                  </p>
                  <p className="text-xs text-gray-500">vs highest rate</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
