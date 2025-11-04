"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calculator, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatIndianCompactCurrency } from "@/lib/loan-utils";
import { calculateHomeLoanTaxBenefits, type TaxRegime } from "@/lib/tax-utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import StrategyAccessGuard from "@/components/strategy-access-guard";

export default function RentVsBuyStrategy() {
  const [propertyPrice, setPropertyPrice] = useState(10000000);
  const [monthlyRent, setMonthlyRent] = useState(50000);
  const [downPayment, setDownPayment] = useState(2000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [propertyAppreciation, setPropertyAppreciation] = useState(4);
  const [rentIncrease, setRentIncrease] = useState(4);
  const [taxableIncome, setTaxableIncome] = useState(1200000);
  const [regime, setRegime] = useState<TaxRegime>("old");

  const loanAmount = propertyPrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = tenureYears * 12;

  // Calculate monthly EMI
  const monthlyEMI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
                     (Math.pow(1 + monthlyRate, totalMonths) - 1);

  // Calculate tax deduction on interest (assuming 30% tax bracket)
  const taxRate = 0.30;
  let totalInterest = 0;
  let totalTaxBenefit = 0;
  let currentLoanBalance = loanAmount;

  for (let m = 0; m < totalMonths; m++) {
    const interest = currentLoanBalance * monthlyRate;
    totalInterest += interest;
    totalTaxBenefit += interest * (taxRate / 12);
    const principal = monthlyEMI - interest;
    currentLoanBalance -= principal;
  }

  // Build 20-year comparison
  const comparisonData = [];
  let currentPropertyValue = propertyPrice;
  let cumulativeBuyNow = downPayment; // EMI + maintenance + property tax
  let cumulativeRent = 0;
  let propertyBalance = loanAmount;
  let monthlyRentCurrent = monthlyRent;
  const monthlyApprRate = propertyAppreciation / 100 / 12;
  const monthlyRentIncreaseRate = rentIncrease / 100 / 12;

  for (let year = 1; year <= tenureYears; year++) {
    let yearlyBuyCost = 0;
    let yearlyRentCost = 0;

    for (let month = 0; month < 12; month++) {
      // Buy: EMI + maintenance (0.5% annual) + property tax (0.05% annual)
      const interestPart = propertyBalance * monthlyRate;
      const principalPart = monthlyEMI - interestPart;
      propertyBalance -= principalPart;

      const maintenanceCost = propertyPrice * 0.005 / 12; // 0.5% annual maintenance
      const propertyTax = propertyPrice * 0.0005 / 12; // 0.05% annual property tax
      const monthlyBuyCost = monthlyEMI + maintenanceCost + propertyTax;

      // Tax benefit (assume deduction of 30% of interest)
      const taxBenefit = interestPart * taxRate;
      yearlyBuyCost += monthlyBuyCost - taxBenefit;

      // Rent: increases annually
      yearlyRentCost += monthlyRentCurrent;
      monthlyRentCurrent = monthlyRentCurrent * (1 + monthlyRentIncreaseRate);

      // Property appreciation
      currentPropertyValue = currentPropertyValue * (1 + monthlyApprRate);
    }

    cumulativeBuyNow += yearlyBuyCost;
    cumulativeRent += yearlyRentCost;

    const netBuyPosition = currentPropertyValue - propertyBalance - cumulativeBuyNow;
    const netRentPosition = -cumulativeRent;
    const buyAdvantage = netBuyPosition - netRentPosition;

    comparisonData.push({
      year,
      propertyValue: Math.round(currentPropertyValue),
      cumulativeBuyCost: Math.round(cumulativeBuyNow),
      cumulativeRentCost: Math.round(cumulativeRent),
      loanBalance: Math.max(0, Math.round(propertyBalance)),
      netBuyWorth: Math.round(netBuyPosition),
      netRentWorth: Math.round(netRentPosition),
      buyAdvantage: Math.round(buyAdvantage)
    });
  }

  const finalBuyCost = comparisonData[tenureYears - 1].netBuyWorth;
  const finalRentCost = comparisonData[tenureYears - 1].netRentWorth;
  const finalAdvantage = finalBuyCost - finalRentCost;

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
    <StrategyAccessGuard strategyNumber={12}>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Strategy #12: Rent vs Buy
            </h1>
            <p className="text-gray-600 mt-2">
              20-year financial comparison: Buying vs Renting
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
              This isn't about "buying is always better" or "renting is throwing money away." It's pure math. When you rent and invest the difference (home price - rent), can your investments outgrow the property appreciation? In Tier-1 cities with 2-3% rental yields, often YES. In Tier-2/3 cities with 4-5% yields and higher appreciation, often NO. The "right" answer depends on city, property type, and investment discipline.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-900">📋 How to Execute:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Decide property type and location (₹50L or ₹2Cr makes a difference!)</li>
                <li>Calculate ACTUAL costs of buying: EMI + maintenance + property tax + repairs</li>
                <li>Calculate renting cost: Monthly rent (typically 50-60% of EMI)</li>
                <li>Invest the difference in diversified portfolio (70% equity, 30% debt for 20 years)</li>
                <li>Factor in opportunity cost: Down payment 20% could grow at 12% if invested</li>
                <li>Consider intangibles: Stability? Kids' school? Landlord hassles? Emotional value?</li>
                <li>Use calculator above to model YOUR scenario with YOUR numbers</li>
                <li>Review after 5 years: Renting can be bridge to better property later</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Property & Financial Parameters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label>Property Price (₹)</Label>
                <Input
                  type="number"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(Number(e.target.value))}
                  step="500000"
                />
              </div>
              <div className="space-y-2">
                <Label>Down Payment (₹)</Label>
                <Input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  step="100000"
                />
              </div>
              <div className="space-y-2">
                <Label>Monthly Rent (₹)</Label>
                <Input
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  step="5000"
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
            </div>
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Tenure (Years)</Label>
                <Input
                  type="number"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  step="1"
                />
              </div>
              <div className="space-y-2">
                <Label>Property Appreciation (%/year)</Label>
                <Input
                  type="number"
                  value={propertyAppreciation}
                  onChange={(e) => setPropertyAppreciation(Number(e.target.value))}
                  step="0.5"
                />
              </div>
              <div className="space-y-2">
                <Label>Rent Increase (%/year)</Label>
                <Input
                  type="number"
                  value={rentIncrease}
                  onChange={(e) => setRentIncrease(Number(e.target.value))}
                  step="0.5"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Monthly EMI</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₹{Math.round(monthlyEMI).toLocaleString('en-IN')}</p>
              <p className="text-xs text-gray-500 mt-2">vs Rent: ₹{monthlyRent.toLocaleString('en-IN')}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-blue-700">Property Value (Year 20)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-700">
                ₹{comparisonData[tenureYears - 1].propertyValue.toLocaleString('en-IN')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-green-700">Buy Net Worth</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-700">
                ₹{finalBuyCost.toLocaleString('en-IN')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="pb-3">
              <CardDescription className="text-purple-700">Buy Wins By</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-700">
                ₹{Math.round(finalAdvantage).toLocaleString('en-IN')}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              20-Year Wealth Comparison
            </CardTitle>
            <CardDescription>
              Net worth progression: Buying vs Renting over 20 years
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                <YAxis
                  label={{ value: 'Net Worth', angle: -90, position: 'insideLeft' }}
                  tickFormatter={(value) => formatIndianCompactCurrency(value)}
                />
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="netBuyWorth"
                  stroke="#10b981"
                  name="Buy: Net Worth"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="netRentWorth"
                  stroke="#ef4444"
                  name="Rent: Net Worth"
                  dot={false}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="propertyValue"
                  stroke="#8b5cf6"
                  name="Property Value"
                  dot={false}
                  strokeWidth={1}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle>💰 Total Savings Breakdown (Year 1)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Property Appreciation:</span>
                <span className="font-semibold">₹{Math.round(propertyPrice * (propertyAppreciation / 100)).toLocaleString("en-IN")}</span>
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
                <span className="text-xl font-bold">Net Benefit (Year 1):</span>
                <span className="text-xl font-bold text-green-600">
                  ₹{(Math.round(propertyPrice * (propertyAppreciation / 100)) + taxBenefits.totalBenefit).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Buy (Loan + Property)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Down Payment</span>
                <span className="font-semibold">₹{downPayment.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Total EMI Paid (20 years)</span>
                <span className="font-semibold">₹{(monthlyEMI * totalMonths).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Maintenance & Tax</span>
                <span className="font-semibold">₹{((propertyPrice * 0.005 + propertyPrice * 0.0005) * tenureYears).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Tax Benefits (Section 24)</span>
                <span className="font-semibold">-₹{Math.round(totalTaxBenefit).toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Final Property Value</span>
                <span>₹{comparisonData[tenureYears - 1].propertyValue.toLocaleString('en-IN')}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rent (Pure Expense)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Initial Monthly Rent</span>
                <span className="font-semibold">₹{monthlyRent.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Rent Increase Rate</span>
                <span className="font-semibold">{rentIncrease}% p.a.</span>
              </div>
              <div className="flex justify-between">
                <span>Total Rent Paid (20 years)</span>
                <span className="font-semibold">₹{comparisonData[tenureYears - 1].cumulativeRentCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Final Monthly Rent</span>
                <span className="font-semibold">₹{Math.round(monthlyRent * Math.pow(1 + rentIncrease / 100, tenureYears)).toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Asset Built</span>
                <span>₹0</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Rent vs Buy Analysis</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Property Appreciation:</strong> {propertyAppreciation}% annual growth builds wealth over time</li>
              <li><strong>Rent Growth:</strong> {rentIncrease}% annual increase = recurring expensive liability</li>
              <li><strong>EMI vs Rent:</strong> ₹{Math.round(monthlyEMI).toLocaleString('en-IN')} EMI vs ₹{monthlyRent.toLocaleString('en-IN')} initial rent seems close initially</li>
              <li><strong>Key Difference:</strong> EMI is same 20 years; rent becomes ₹{Math.round(monthlyRent * Math.pow(1 + rentIncrease / 100, tenureYears)).toLocaleString('en-IN')}/month!</li>
              <li><strong>Tax Benefit:</strong> Save ₹{Math.round(totalTaxBenefit / 100000)} L in taxes through interest deduction</li>
              <li><strong>20-Year Result:</strong> Buy gives ₹{Math.round(finalAdvantage / 1000000).toFixed(1)} crore more wealth than renting</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">💡 Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="text-amber-800">
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>When to Buy:</strong> Long-term settling (10+ years), stable income, ready down payment</li>
              <li><strong>When to Rent:</strong> Job uncertainty, frequent relocations, capital needed elsewhere</li>
              <li><strong>Emotional Factor:</strong> Home ownership means stability & pride - quantify vs numbers</li>
              <li><strong>Location Matters:</strong> Tier-1 cities: appreciation ≈ rent, Tier-2: buying wins heavily</li>
              <li><strong>Inflation Edge:</strong> EMI is fixed; rent spirals with inflation = buying becomes cheaper</li>
              <li><strong>Break-Even Point:</strong> Usually 7-10 years when buying becomes financially superior</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
    </StrategyAccessGuard>
  );
}
