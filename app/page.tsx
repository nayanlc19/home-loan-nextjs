"use client";

import { useSession, signOut } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  TrendingDown,
  Calculator,
  PiggyBank,
  Shield,
  Sparkles,
  BarChart3,
  IndianRupee,
  Users,
  LogOut,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

// Sample data for visualization
const savingsData = [
  { year: 0, traditional: 0, optimized: 0 },
  { year: 5, traditional: 500000, optimized: 800000 },
  { year: 10, traditional: 1200000, optimized: 1800000 },
  { year: 15, traditional: 2000000, optimized: 3200000 },
  { year: 20, traditional: 3000000, optimized: 5000000 },
];

const strategyComparison = [
  { month: 1, baseline: 45000, biweekly: 47000 },
  { month: 6, baseline: 270000, biweekly: 282000 },
  { month: 12, baseline: 540000, biweekly: 564000 },
  { month: 24, baseline: 1080000, biweekly: 1200000 },
  { month: 36, baseline: 1620000, biweekly: 1900000 },
];

// Format numbers in Indian style (K, L, Cr)
const formatIndianCurrency = (value: number): string => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  } else if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}K`;
  }
  return `₹${value}`;
};

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <PiggyBank className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Home Loan Toolkit
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/strategies/all">
              <Button variant="ghost">Strategies</Button>
            </Link>
            <Link href="/banks">
              <Button variant="ghost">Banks</Button>
            </Link>
            <Link href="/guides/tips">
              <Button variant="ghost">Tips & Tricks</Button>
            </Link>
            <Link href="/guides/hidden-costs">
              <Button variant="ghost">Hidden Costs</Button>
            </Link>
            {session?.user ? (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="px-4 py-2">
                  {session.user.name || session.user.email}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              Save ₹8-25 Lakhs on Your Home Loan
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Master Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Home Loan
              </span>{" "}
              Journey
            </h1>
            <p className="text-xl text-gray-600">
              12 proven strategies with beautiful interactive calculators. Visualize your savings,
              optimize taxes, and take control of your financial future.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/strategies/all">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Sparkles className="mr-2 h-5 w-5" />
                  View All 12 Strategies
                </Button>
              </Link>
              <Link href="/strategies">
                <Button size="lg" variant="outline">
                  <Calculator className="mr-2 h-5 w-5" />
                  Try Strategy #1 FREE
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">₹99</div>
                <div className="text-sm text-gray-600">One-time payment</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">12</div>
                <div className="text-sm text-gray-600">Proven strategies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">∞</div>
                <div className="text-sm text-gray-600">Lifetime access</div>
              </div>
            </div>
          </div>

          {/* Animated Chart */}
          <Card className="p-6 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4">Your Potential Savings Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={savingsData}>
                <defs>
                  <linearGradient id="colorTraditional" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#9ca3af" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: "Years", position: "insideBottom", offset: -5 }} />
                <YAxis
                  label={{ value: "Savings (₹)", angle: -90, position: "insideLeft" }}
                  tickFormatter={formatIndianCurrency}
                />
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                <Area
                  type="monotone"
                  dataKey="traditional"
                  stroke="#9ca3af"
                  fillOpacity={1}
                  fill="url(#colorTraditional)"
                  name="Traditional Approach"
                />
                <Area
                  type="monotone"
                  dataKey="optimized"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorOptimized)"
                  name="With Our Strategies"
                />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-4 text-center">
              Potential savings of ₹20 Lakhs+ over 20 years
            </p>
          </Card>
        </div>
      </section>

      {/* Emotional Welcome - "Pour Your Heart Out" */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-8 md:p-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-4xl">💚</div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-4">
                  From One Home Buyer to Another
                </h2>
                <div className="space-y-4 text-green-800 text-lg leading-relaxed">
                  <p>
                    I remember my first home loan application. The forms, the documents, the scary numbers...
                    My hands were literally shaking when I signed the loan agreement. ₹50 lakhs over 20 years?
                    That's ₹6 lakhs a year! Would I even have a job for 20 years?
                  </p>
                  <p>
                    If you're feeling scared right now - <strong>you're NORMAL</strong>. A home loan is probably
                    the biggest financial commitment you'll ever make. But here's what I learned:
                    <strong> knowledge removes fear</strong>. Understanding how it all works makes you feel in control.
                  </p>
                  <p>
                    These strategies are everything I wish someone had told me before I started.
                    Read them, save them, come back to them whenever you need reassurance.
                    <strong> You've got this! 🤗</strong>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why Choose Our Toolkit?</h2>
          <p className="text-xl text-gray-600">Everything you need to optimize your home loan</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 hover:shadow-xl transition-shadow">
            <BarChart3 className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Beautiful Visualizations</h3>
            <p className="text-gray-600">
              Interactive charts and graphs powered by D3.js, Recharts, and Chart.js. See your
              savings in real-time.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow">
            <Calculator className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Calculators</h3>
            <p className="text-gray-600">
              12 interactive calculators for every strategy. Input your data and watch the magic
              happen.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow">
            <Shield className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tax Optimization</h3>
            <p className="text-gray-600">
              Complete Section 80C, 24(b), LTCG, and STCG calculations. Maximize your tax savings.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow">
            <TrendingDown className="h-12 w-12 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Proven Strategies</h3>
            <p className="text-gray-600">
              From 100+ real Indian families. Not theory—actual tested strategies that work.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow">
            <Users className="h-12 w-12 text-orange-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Bank Comparison</h3>
            <p className="text-gray-600">
              Compare 6 major banks with real customer reviews, rates, and hidden costs.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow">
            <IndianRupee className="h-12 w-12 text-yellow-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">One-Time ₹99</h3>
            <p className="text-gray-600">
              Lifetime access to all strategies, calculators, and future updates. No subscription.
            </p>
          </Card>
        </div>
      </section>

      {/* Strategy Preview Chart */}
      <section className="container mx-auto px-4 py-20">
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Bi-Weekly Strategy vs Traditional EMI
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={strategyComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" label={{ value: "Months", position: "insideBottom", offset: -5 }} />
              <YAxis
                label={{ value: "Amount Paid (₹)", angle: -90, position: "insideLeft" }}
                tickFormatter={formatIndianCurrency}
              />
              <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
              <Line
                type="monotone"
                dataKey="baseline"
                stroke="#94a3b8"
                strokeWidth={2}
                name="Traditional EMI"
              />
              <Line
                type="monotone"
                dataKey="biweekly"
                stroke="#8b5cf6"
                strokeWidth={3}
                name="Bi-Weekly Strategy"
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-center mt-6 text-gray-600">
            Save ₹3-5 Lakhs with just this one strategy (Strategy #1 - FREE!)
          </p>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="p-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Save Lakhs?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of smart home buyers who've optimized their loans
          </p>
          <Link href="/strategies">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started for ₹99
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>© 2025 N Education - Home Loan Toolkit. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/terms" className="hover:text-blue-600">Terms</Link>
            <Link href="/privacy" className="hover:text-blue-600">Privacy</Link>
            <Link href="/refund" className="hover:text-blue-600">Refund Policy</Link>
            <Link href="/contact" className="hover:text-blue-600">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
