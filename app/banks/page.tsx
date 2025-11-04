"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Star, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, XCircle, Building2, Users, Target, Percent } from "lucide-react";
import { calculatePersonalizedRate, type UserProfile, type CreditScoreBand, type Gender, type EmploymentType, type Location } from "@/lib/rate-utils";
import { calculateEMI, calculateTotalInterest, formatIndianCurrency } from "@/lib/loan-utils";

const bankData = [
  {
    name: "SBI",
    rate: 8.50,
    rating: 4.0,
    totalReviews: 1429,
    serviceQuality: "Mixed",
    processingFee: "0%",
    pros: [
      "Lowest interest rates among major banks",
      "No processing fees (0% vs 0.35-1% at others)",
      "Many offers and discounts available",
      "0.05% off for women borrowers"
    ],
    cons: [
      "Customer service issues - difficult to reach on phone",
      "Slow processing (3-4 weeks vs 2-3 weeks typical)",
      "Branch experience varies significantly",
      "Cumbersome documentation process"
    ],
    whyThisRate: "As a PSU bank, SBI offers lower rates but compensates with slower processing and limited customer service. Government backing allows competitive pricing.",
    bestFor: "Price-conscious borrowers who can tolerate slower processing",
    avoidIf: "You need quick approval or premium customer service",
    color: "blue"
  },
  {
    name: "HDFC",
    rate: 8.60,
    rating: 4.0,
    totalReviews: 6443,
    serviceQuality: "Mixed",
    processingFee: "0.50%",
    pros: [
      "Quick processing (10-20 days approval possible)",
      "Attractive interest rates",
      "Good for salaried women (0.05% discount)",
      "Strong brand reputation"
    ],
    cons: [
      "Pathetic customer service at branches (per reviews)",
      "Complaints often closed without resolution",
      "Initial processing can be worst in service",
      "Disbursement delays reported causing builder penalties"
    ],
    whyThisRate: "HDFC balances competitive rates with faster processing. Private bank efficiency but service quality varies by branch. Premium for faster approval.",
    bestFor: "Borrowers needing fast approval who can navigate service issues",
    avoidIf: "You expect consistent premium customer service",
    color: "purple"
  },
  {
    name: "ICICI",
    rate: 8.75,
    rating: 1.6,
    totalReviews: 131,
    serviceQuality: "Poor",
    processingFee: "0.25-1%",
    pros: [
      "Lower processing fees (0.25% in some cases)",
      "Some customers got approval within 28 days",
      "Digital infrastructure",
      "Helpful customer reps (when reached)"
    ],
    cons: [
      "Predominantly negative reviews (1.6/5 rating)",
      "NRI home loans described as 'nightmare'",
      "Zero clarity on documentation",
      "Unprofessional service and constant delays",
      "No accountability or transparency",
      "AI assistant makes reaching humans difficult"
    ],
    whyThisRate: "Higher rate of 8.75% reflects poor service quality and operational inefficiencies. Bank compensates for customer service issues with higher pricing. Premium charged but service doesn't match.",
    bestFor: "Existing ICICI customers with relationship manager",
    avoidIf: "You're an NRI, need clarity, or expect professional service",
    color: "red"
  },
  {
    name: "Axis",
    rate: 8.65,
    rating: 3.5,
    totalReviews: 450,
    serviceQuality: "Average",
    processingFee: "1%",
    pros: [
      "Competitive rates for salaried professionals",
      "0.05% off for defense personnel",
      "Decent digital banking interface",
      "Growing branch network"
    ],
    cons: [
      "Higher processing fee (1% vs 0.35-0.5%)",
      "Service quality varies by branch",
      "Not as established as HDFC/ICICI in home loans"
    ],
    whyThisRate: "Axis prices competitively to gain market share. Higher processing fees compensate for lower interest rate. Good balance for employed professionals.",
    bestFor: "Defense personnel, salaried professionals in metro cities",
    avoidIf: "You want established home loan processes",
    color: "orange"
  },
  {
    name: "Kotak",
    rate: 8.70,
    rating: 3.8,
    totalReviews: 320,
    serviceQuality: "Good",
    processingFee: "0.50%",
    pros: [
      "Competitive interest rates",
      "Better customer service than ICICI/Axis",
      "Faster processing for existing customers",
      "Good digital experience"
    ],
    cons: [
      "Limited branch network compared to HDFC/ICICI",
      "Fewer special offers/discounts",
      "New entrant in home loan market"
    ],
    whyThisRate: "Kotak offers decent rates to build market share. Better service than competitors at same price point. Focus on quality over volume.",
    bestFor: "Existing Kotak customers, urban borrowers",
    avoidIf: "You need extensive branch network",
    color: "indigo"
  },
  {
    name: "PNB",
    rate: 8.40,
    rating: 3.9,
    totalReviews: 890,
    serviceQuality: "Average",
    processingFee: "0.35%",
    pros: [
      "Lowest rate (8.40%) among all banks",
      "Low processing fee (0.35%)",
      "PSU bank stability",
      "0.05% off for women borrowers"
    ],
    cons: [
      "PSU bank bureaucracy and delays",
      "Limited digital infrastructure",
      "Branch service quality inconsistent",
      "Documentation can be extensive"
    ],
    whyThisRate: "As PSU bank, PNB offers rock-bottom rates to compete with SBI. Government backing allows aggressive pricing. Trade-off is slower service and bureaucracy.",
    bestFor: "Price-sensitive borrowers with time flexibility",
    avoidIf: "You need modern digital experience or fast processing",
    color: "green"
  }
];

const getServiceBadge = (quality: string) => {
  switch (quality) {
    case "Good":
      return <Badge className="bg-green-100 text-green-800">Good Service</Badge>;
    case "Average":
      return <Badge className="bg-yellow-100 text-yellow-800">Average Service</Badge>;
    case "Mixed":
      return <Badge className="bg-orange-100 text-orange-800">Mixed Service</Badge>;
    case "Poor":
      return <Badge className="bg-red-100 text-red-800">Poor Service</Badge>;
    default:
      return <Badge variant="secondary">{quality}</Badge>;
  }
};

export default function BanksPage() {
  // State for personalized rate calculator
  const [creditScore, setCreditScore] = useState<CreditScoreBand>("750+");
  const [age, setAge] = useState(35);
  const [gender, setGender] = useState<Gender>("male");
  const [employment, setEmployment] = useState<EmploymentType>("salaried-other");
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [location, setLocation] = useState<Location>("metro-tier1");
  const [tenure, setTenure] = useState(20);

  const userProfile: UserProfile = {
    creditScore,
    age,
    gender,
    employment,
    loanAmount,
    location,
  };

  // Calculate personalized rates for each bank
  const personalizedRates = bankData.map(bank => {
    const result = calculatePersonalizedRate(bank.rate, userProfile);
    const emi = calculateEMI(loanAmount, result.adjustedRate, tenure);
    const totalInterest = calculateTotalInterest(loanAmount, result.adjustedRate, tenure);
    const savingsVsHighest = calculateTotalInterest(loanAmount, 8.75, tenure) - totalInterest;

    return {
      ...bank,
      personalizedRate: result.adjustedRate,
      adjustment: result.totalAdjustment,
      emi,
      totalInterest,
      savingsVsHighest,
    };
  }).sort((a, b) => a.personalizedRate - b.personalizedRate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bank Reviews & Comparison
            </h1>
            <p className="text-gray-600 mt-2">
              Find YOUR best rate based on your profile + Real customer reviews
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">← Home</Button>
          </Link>
        </div>

        {/* Important Notice */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-amber-800">
                <strong>Important:</strong> Interest rates and reviews updated January 29, 2025.
                Actual rates may vary based on your credit score, loan amount, and employment type.
                Always check current rates directly with banks before making decisions.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personalized Rate Calculator Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-blue-600" />
              <div>
                <CardTitle className="text-2xl">Find YOUR Best Rate</CardTitle>
                <CardDescription>
                  Get personalized rates based on your unique profile (6 factors)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Inputs */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="creditScore">Credit Score</Label>
                <Select value={creditScore} onValueChange={(val) => setCreditScore(val as CreditScoreBand)}>
                  <SelectTrigger id="creditScore">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="750+">750+ (Excellent)</SelectItem>
                    <SelectItem value="700-749">700-749 (Good)</SelectItem>
                    <SelectItem value="650-699">650-699 (Fair)</SelectItem>
                    <SelectItem value="<650">&lt;650 (Poor)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Higher = Better rate</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employment">Employment Type</Label>
                <Select value={employment} onValueChange={(val) => setEmployment(val as EmploymentType)}>
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
                <p className="text-xs text-gray-500">Govt/MNC get best rates</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Property Location</Label>
                <Select value={location} onValueChange={(val) => setLocation(val as Location)}>
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

              <div className="space-y-2">
                <Label htmlFor="age">Age: {age} years</Label>
                <Slider
                  id="age"
                  min={23}
                  max={62}
                  step={1}
                  value={[age]}
                  onValueChange={(val) => setAge(val[0])}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500">25-35 years get best rates</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  step={100000}
                  min={100000}
                />
                <p className="text-xs text-gray-500">₹{(loanAmount / 100000).toFixed(1)}L - Higher loans get better rates</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={(val) => setGender(val as Gender)}>
                  <SelectTrigger id="gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female (0.05% off)</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Women get 0.05% concession</p>
              </div>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Percent className="h-5 w-5 text-blue-600" />
                Banks Ranked for YOUR Profile
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left p-2">Rank</th>
                      <th className="text-left p-2">Bank</th>
                      <th className="text-right p-2">Base Rate</th>
                      <th className="text-right p-2">YOUR Rate</th>
                      <th className="text-right p-2">Adjustment</th>
                      <th className="text-right p-2">Monthly EMI</th>
                      <th className="text-right p-2">You Save (20y)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {personalizedRates.map((bank, index) => (
                      <tr key={bank.name} className={`border-b ${index === 0 ? 'bg-green-50' : ''}`}>
                        <td className="p-2">
                          {index === 0 ? (
                            <Badge className="bg-green-600">🏆 Best</Badge>
                          ) : (
                            <span className="text-gray-600">#{index + 1}</span>
                          )}
                        </td>
                        <td className="p-2 font-semibold">{bank.name}</td>
                        <td className="text-right p-2 text-gray-600">{bank.rate.toFixed(2)}%</td>
                        <td className="text-right p-2">
                          <span className="font-bold text-blue-600">{bank.personalizedRate.toFixed(2)}%</span>
                        </td>
                        <td className="text-right p-2">
                          <span className={bank.adjustment < 0 ? 'text-green-600' : 'text-red-600'}>
                            {bank.adjustment > 0 ? '+' : ''}{bank.adjustment.toFixed(2)}%
                          </span>
                        </td>
                        <td className="text-right p-2 font-semibold">
                          {formatIndianCurrency(bank.emi)}
                        </td>
                        <td className="text-right p-2">
                          <span className="font-bold text-green-600">
                            {formatIndianCurrency(bank.savingsVsHighest)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                * Savings shown vs highest rate (8.75%) for ₹{(loanAmount/100000).toFixed(1)}L over {tenure} years
              </p>
            </div>

            <div className="flex items-center justify-between bg-blue-100 p-4 rounded-lg">
              <div>
                <p className="text-sm text-blue-800">
                  <strong>Your Best Bank:</strong> {personalizedRates[0].name} at {personalizedRates[0].personalizedRate.toFixed(2)}%
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Save {formatIndianCurrency(personalizedRates[0].savingsVsHighest)} vs highest rate
                </p>
              </div>
              <Link href="/calculators/personalized-rate">
                <Button variant="default">
                  Detailed Analysis →
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Sorting Info */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-600">Sorted by Interest Rate (Low to High)</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-gray-600">Customer ratings from actual reviews</span>
          </div>
        </div>

        {/* Bank Cards */}
        <div className="grid grid-cols-1 gap-6">
          {bankData.sort((a, b) => a.rate - b.rate).map((bank, index) => (
            <Card key={bank.name} className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-${bank.color}-100`}>
                      <Building2 className={`h-8 w-8 text-${bank.color}-600`} />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{bank.name}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold">{bank.rating}</span>
                          <span className="text-gray-400">({bank.totalReviews.toLocaleString('en-IN')} reviews)</span>
                        </div>
                        {getServiceBadge(bank.serviceQuality)}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">{bank.rate}%</div>
                    <div className="text-sm text-gray-600">Interest Rate</div>
                    <div className="text-xs text-gray-500 mt-1">Processing: {bank.processingFee}</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Pros & Cons */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      What's Good
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {bank.pros.map((pro, i) => (
                        <li key={i} className="text-green-600 flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Watch Out For
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {bank.cons.map((con, i) => (
                        <li key={i} className="text-red-600 flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">✗</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Why This Rate */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 Why {bank.rate}% Rate?</h4>
                  <p className="text-blue-800 text-sm">{bank.whyThisRate}</p>
                </div>

                {/* Best For / Avoid If */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2">👍 Best For:</h4>
                    <p className="text-green-800 text-sm">{bank.bestFor}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-900 mb-2">⚠️ Avoid If:</h4>
                    <p className="text-red-800 text-sm">{bank.avoidIf}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Ready to Calculate Your Savings?</h3>
            <p className="mb-6 opacity-90">
              Use our 12 proven strategies to save ₹8-25 Lakhs on your home loan
            </p>
            <Link href="/strategies/all">
              <Button size="lg" variant="secondary">
                View All Strategies →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
