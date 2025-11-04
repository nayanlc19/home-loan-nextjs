"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingDown,
  Calculator,
  Coins,
  TrendingUp,
  PiggyBank,
  BarChart3,
  ArrowRightLeft,
  Wallet,
  Home,
  CalendarClock,
  Building,
  Sparkles
} from "lucide-react";
import Link from "next/link";

const strategies = [
  // HARD STRATEGIES (Most Complex)
  {
    id: 1,
    title: "Overdraft Loan Strategy",
    description: "Convert home loan to overdraft. Park savings in OD account to reduce daily interest calculation.",
    icon: PiggyBank,
    savings: "₹15-20 Lakhs",
    time: "4-6 Years",
    difficulty: "Hard",
    href: "/strategies/overdraft",
    available: true,
  },
  {
    id: 2,
    title: "Top-Up Loan Consolidation",
    description: "Consolidate high-interest loans into low-interest home loan top-up. Optimize total debt cost.",
    icon: Building,
    savings: "₹10-25 Lakhs",
    time: "5-10 Years",
    difficulty: "Hard",
    href: "/strategies/top-up",
    available: true,
  },
  {
    id: 3,
    title: "Early Closure vs Investment",
    description: "Close loan early or invest? Compare opportunity cost with risk-free returns.",
    icon: CalendarClock,
    savings: "Optimize Wealth",
    time: "Varies",
    difficulty: "Hard",
    href: "/strategies/early-closure",
    available: true,
  },
  // MEDIUM STRATEGIES (Moderate Complexity)
  {
    id: 4,
    title: "Lump Sum Accelerator",
    description: "Use bonus, inheritance, or windfall for strategic prepayment. Compare timing impact on total interest.",
    icon: Coins,
    savings: "₹10-15 Lakhs",
    time: "5-7 Years",
    difficulty: "Medium",
    href: "/strategies/lump-sum",
    available: true,
  },
  {
    id: 5,
    title: "SIP vs Prepayment",
    description: "Should you invest in SIP or prepay loan? Compare returns accounting for tax benefits and interest rates.",
    icon: TrendingUp,
    savings: "Maximize Returns",
    time: "Varies",
    difficulty: "Medium",
    href: "/strategies/sip-vs-prepay",
    available: true,
  },
  {
    id: 6,
    title: "Part-Prepayment Strategy",
    description: "Reduce EMI vs Reduce Tenure? Optimal prepayment schedule based on your financial goals.",
    icon: ArrowRightLeft,
    savings: "₹8-14 Lakhs",
    time: "3-5 Years",
    difficulty: "Medium",
    href: "/strategies/part-prepayment",
    available: true,
  },
  {
    id: 7,
    title: "Balance Transfer Magic",
    description: "Switch to lower interest rate bank. Calculate breakeven point considering processing fees.",
    icon: Wallet,
    savings: "₹5-12 Lakhs",
    time: "2-4 Years",
    difficulty: "Medium",
    href: "/strategies/balance-transfer",
    available: true,
  },
  {
    id: 8,
    title: "Flexi-Loan Advantage",
    description: "Withdraw prepaid amount when needed. Flexibility + savings. Best of both worlds!",
    icon: Sparkles,
    savings: "₹8-15 Lakhs",
    time: "4-7 Years",
    difficulty: "Medium",
    href: "/strategies/flexi-loan",
    available: true,
  },
  // EASY STRATEGIES (Beginner Friendly)
  {
    id: 9,
    title: "Bi-Weekly Payment Hack",
    description: "Pay half your EMI every 2 weeks instead of monthly. Make 26 payments/year = 13 monthly payments. Save years off your loan!",
    icon: TrendingDown,
    savings: "₹8-12 Lakhs",
    time: "3-5 Years",
    difficulty: "Easy",
    href: "/strategies",
    available: true,
  },
  {
    id: 10,
    title: "Tax Refund Amplification",
    description: "Use annual tax refunds (₹80C deductions) for prepayment. Compound savings through year-by-year reduction.",
    icon: Calculator,
    savings: "₹6-10 Lakhs",
    time: "2-4 Years",
    difficulty: "Easy",
    href: "/strategies/tax-refund",
    available: true,
  },
  {
    id: 11,
    title: "Step-Up EMI Plan",
    description: "Increase EMI by 5-10% annually as income grows. Massive reduction in tenure and interest.",
    icon: BarChart3,
    savings: "₹12-18 Lakhs",
    time: "6-8 Years",
    difficulty: "Easy",
    href: "/strategies/step-up-emi",
    available: true,
  },
  {
    id: 12,
    title: "Rent vs Buy Calculator",
    description: "Should you buy or rent? 20-year comparison with investment returns and tax benefits.",
    icon: Home,
    savings: "Informed Decision",
    time: "20 Years",
    difficulty: "Easy",
    href: "/strategies/rent-vs-buy",
    available: true,
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-800 border-green-300";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "Hard":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function AllStrategies() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            12 Proven Strategies
          </h1>
          <p className="text-xl text-blue-100">
            Save ₹8-25 Lakhs on your home loan with expert-backed strategies
          </p>
        </div>
      </div>

      {/* Strategies Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategies.map((strategy) => {
            const Icon = strategy.icon;
            return (
              <Card
                key={strategy.id}
                className="hover:shadow-xl transition-shadow duration-300 border-2 hover:border-purple-300"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                      <Icon className="h-8 w-8 text-purple-600" />
                    </div>
                    <Badge
                      variant="outline"
                      className={getDifficultyColor(strategy.difficulty)}
                    >
                      {strategy.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">
                    {strategy.id}. {strategy.title}
                  </CardTitle>
                  <CardDescription className="text-sm mt-2">
                    {strategy.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Potential Savings:</span>
                      <span className="font-semibold text-green-600">
                        {strategy.savings}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Time Reduced:</span>
                      <span className="font-semibold text-blue-600">
                        {strategy.time}
                      </span>
                    </div>
                    <Link href={strategy.href}>
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Calculate Savings →
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="text-2xl">
                Ready to Save Lakhs on Your Home Loan?
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Start with any strategy above and see your personalized savings calculator!
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
