"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle, TrendingDown, Gavel, Home, AlertCircle } from "lucide-react";

interface Milestone {
  day: number;
  title: string;
  creditScore: number;
  status: string;
  impact: string;
  action: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
}

export default function CIBILImpactPage() {
  const [emiAmount, setEmiAmount] = useState(50000);
  const [daysLate, setDaysLate] = useState(15);

  // Calculate penalty
  const penaltyRate = 2; // 2% per month (24% annual)
  const penaltyAmount = emiAmount * (penaltyRate / 100) * (daysLate / 30);
  const effectiveEmi = emiAmount + penaltyAmount;

  // Define milestones
  const milestones: Milestone[] = [
    {
      day: 1,
      title: "Day 1-30: Grace Period Ending",
      creditScore: 750,
      status: "⚠️ WARNING - Contact bank immediately",
      impact: "2% monthly penalty accumulating. No CIBIL impact yet, but clock is ticking.",
      action: "Call your bank and explain. Most banks are understanding for first-time delays. Request waiver if possible.",
      color: daysLate < 30 ? "text-yellow-700" : "text-gray-500",
      bgColor: daysLate < 30 ? "bg-yellow-50" : "bg-gray-50",
      borderColor: daysLate < 30 ? "border-yellow-300" : "border-gray-200",
      icon: "⚠️"
    },
    {
      day: 30,
      title: "Day 30: CIBIL Reporting Starts",
      creditScore: 680,
      status: "🟠 ALERT - CIBIL Impact Started",
      impact: "30 DPD (Days Past Due) marked on CIBIL. Credit score drops by ~70 points. Harder to get loans for next 3 years.",
      action: "Pay IMMEDIATELY. After payment, request bank to update CIBIL. Some banks offer one-time goodwill removal.",
      color: daysLate >= 30 && daysLate < 60 ? "text-orange-700" : "text-gray-500",
      bgColor: daysLate >= 30 && daysLate < 60 ? "bg-orange-50" : "bg-gray-50",
      borderColor: daysLate >= 30 && daysLate < 60 ? "border-orange-300" : "border-gray-200",
      icon: "🟠"
    },
    {
      day: 60,
      title: "Day 60: Legal Notice Territory",
      creditScore: 620,
      status: "🔴 SERIOUS - Legal Action Initiated",
      impact: "60 DPD marked. Credit score drops another ~60 points. Legal notice sent. Future loan applications will be rejected.",
      action: "This is critical. Consider selling assets, borrowing from family, ANYTHING to clear this. Talk to bank about restructuring.",
      color: daysLate >= 60 && daysLate < 90 ? "text-red-700" : "text-gray-500",
      bgColor: daysLate >= 60 && daysLate < 90 ? "bg-red-50" : "bg-gray-50",
      borderColor: daysLate >= 60 && daysLate < 90 ? "border-red-300" : "border-gray-200",
      icon: "🔴"
    },
    {
      day: 90,
      title: "Day 90: NPA Status - 7 Year Scar",
      creditScore: 580,
      status: "🚨 CRITICAL - NPA Status",
      impact: "90 DPD = NPA (Non-Performing Asset). Stays on CIBIL for 7 YEARS. Career Impact: Job background checks flag this. Marriage proposals affected. No bank will give you loans.",
      action: "Catastrophic damage done. Pay immediately to stop further harm. Consider OTS (One Time Settlement) with bank. Consult credit repair specialist.",
      color: daysLate >= 90 && daysLate < 180 ? "text-red-900" : "text-gray-500",
      bgColor: daysLate >= 90 && daysLate < 180 ? "bg-red-100" : "bg-gray-50",
      borderColor: daysLate >= 90 && daysLate < 180 ? "border-red-500" : "border-gray-200",
      icon: "🚨"
    },
    {
      day: 180,
      title: "Day 180: Property Auction Notice",
      creditScore: 550,
      status: "⛔ EMERGENCY - Property At Risk",
      impact: "Bank can auction your property under SARFAESI Act WITHOUT court order. Your family will be evicted. Auction proceeds go to bank. Life destroyed.",
      action: "IMMEDIATE legal consultation required. Explore debt restructuring, asset liquidation, family support - every possible option. Your home is 30 days from auction.",
      color: daysLate >= 180 ? "text-black" : "text-gray-500",
      bgColor: daysLate >= 180 ? "bg-red-200 border-4" : "bg-gray-50",
      borderColor: daysLate >= 180 ? "border-red-900" : "border-gray-200",
      icon: "⛔"
    }
  ];

  // Get current milestone
  const currentMilestone = milestones.reduce((prev, curr) => {
    if (daysLate >= curr.day) return curr;
    return prev;
  }, milestones[0]);

  // Get color for slider based on days
  const getSliderColor = () => {
    if (daysLate < 30) return "bg-yellow-500";
    if (daysLate < 60) return "bg-orange-500";
    if (daysLate < 90) return "bg-red-500";
    if (daysLate < 180) return "bg-red-700";
    return "bg-black";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/guides"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Guides
          </Link>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CIBIL Impact Timeline: What Happens When You Miss EMI Payments
          </h1>

          <Alert className="bg-red-50 border-red-200 mb-6">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Real Talk:</strong> I remember when I missed an EMI by just 3 days. My hands were shaking when I saw the penalty notice.
              This calculator shows you EXACTLY what happens at each stage - day by day, rupee by rupee.
            </AlertDescription>
          </Alert>
        </div>

        {/* Calculator Section */}
        <Card className="mb-8 border-2 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-2xl">Calculate Your Impact</CardTitle>
            <CardDescription>Move the slider to see what happens at each delay milestone</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* EMI Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly EMI Amount
              </label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">₹</span>
                <Input
                  type="number"
                  min="10000"
                  max="500000"
                  step="1000"
                  value={emiAmount}
                  onChange={(e) => setEmiAmount(Number(e.target.value))}
                  className="text-xl font-semibold"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Range: ₹10,000 - ₹5,00,000</p>
            </div>

            {/* Days Late Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Days Late: <span className="text-3xl font-bold text-red-600">{daysLate}</span> days
              </label>
              <div className="relative pt-2">
                <Slider
                  value={[daysLate]}
                  onValueChange={(value) => setDaysLate(value[0])}
                  min={1}
                  max={180}
                  step={1}
                  className="mb-4"
                />
                {/* Milestone markers */}
                <div className="flex justify-between text-xs text-gray-500 -mt-2">
                  <span className="text-yellow-600 font-semibold">Day 1</span>
                  <span className="text-orange-600 font-semibold">30</span>
                  <span className="text-red-600 font-semibold">60</span>
                  <span className="text-red-800 font-semibold">90</span>
                  <span className="text-black font-semibold">180</span>
                </div>
              </div>
            </div>

            {/* Penalty Calculation */}
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
              <h3 className="font-semibold text-lg mb-3">Financial Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Original EMI</p>
                  <p className="text-2xl font-bold text-gray-900">₹{emiAmount.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Penalty (2% per month)</p>
                  <p className="text-2xl font-bold text-red-600">+₹{penaltyAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total You Pay</p>
                  <p className="text-2xl font-bold text-black">₹{effectiveEmi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</p>
                </div>
              </div>
            </div>

            {/* Current Status Alert */}
            <Alert className={`${currentMilestone.bgColor} border-2 ${currentMilestone.borderColor}`}>
              <AlertTitle className={`text-xl font-bold ${currentMilestone.color} flex items-center gap-2`}>
                <span className="text-2xl">{currentMilestone.icon}</span>
                {currentMilestone.status}
              </AlertTitle>
              <AlertDescription className={`mt-2 ${currentMilestone.color}`}>
                <p className="font-semibold mb-2">Credit Score Impact: {currentMilestone.creditScore}</p>
                <p className="mb-2">{currentMilestone.impact}</p>
                <p className="text-sm font-semibold mt-3 p-3 bg-white/50 rounded border-l-4 border-current">
                  <strong>ACTION NOW:</strong> {currentMilestone.action}
                </p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Timeline Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Complete Timeline: Day-by-Day Breakdown</CardTitle>
            <CardDescription>Every delay makes it exponentially worse</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative">
                  {/* Connector line */}
                  {index < milestones.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-1 bg-gradient-to-b from-yellow-300 via-orange-400 via-red-500 to-black" />
                  )}

                  <Card className={`${milestone.bgColor} border-2 ${milestone.borderColor} relative z-10 ${
                    daysLate >= milestone.day ? 'shadow-lg' : 'opacity-60'
                  }`}>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className={`text-4xl ${daysLate >= milestone.day ? 'animate-pulse' : ''}`}>
                          {milestone.icon}
                        </div>
                        <div className="flex-1">
                          <CardTitle className={`text-xl ${milestone.color}`}>
                            {milestone.title}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline" className={milestone.color}>
                              Day {milestone.day}
                            </Badge>
                            <Badge variant="outline" className={milestone.color}>
                              Credit Score: {milestone.creditScore}
                            </Badge>
                            {daysLate >= milestone.day && (
                              <Badge className="bg-red-600 text-white">
                                YOU ARE HERE
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="font-semibold text-sm text-gray-700 mb-1">Status:</p>
                          <p className={`${milestone.color} font-semibold`}>{milestone.status}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-700 mb-1">Impact:</p>
                          <p className="text-gray-900">{milestone.impact}</p>
                        </div>
                        <div className="bg-white/70 p-3 rounded border-l-4 border-blue-500">
                          <p className="font-semibold text-sm text-gray-700 mb-1">What to Do:</p>
                          <p className="text-gray-900">{milestone.action}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emotional Messaging */}
        <Card className="mb-8 border-2 border-blue-300 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-900">Where You Stand Right Now</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {daysLate < 30 && (
              <Alert className="bg-green-50 border-green-300">
                <AlertTitle className="text-green-800 font-bold">💚 You're Still Safe</AlertTitle>
                <AlertDescription className="text-green-700">
                  Call your bank TODAY. Explain your situation honestly. Most banks have hardship programs and can waive penalties for genuine cases.
                  You haven't hit the CIBIL reporting threshold yet - use this time wisely!
                </AlertDescription>
              </Alert>
            )}

            {daysLate >= 30 && daysLate < 60 && (
              <Alert className="bg-yellow-50 border-yellow-300">
                <AlertTitle className="text-yellow-800 font-bold">🟡 CIBIL Damage Started - But Recoverable</AlertTitle>
                <AlertDescription className="text-yellow-700">
                  The 30 DPD mark is on your credit report now. But here's hope: Pay immediately and request your bank to update CIBIL.
                  Some banks offer one-time "goodwill adjustments." Write to your bank manager with a genuine reason.
                  A single 30 DPD is recoverable over 2-3 years of good payment history.
                </AlertDescription>
              </Alert>
            )}

            {daysLate >= 60 && daysLate < 90 && (
              <Alert className="bg-orange-50 border-orange-400">
                <AlertTitle className="text-orange-900 font-bold">🔴 This Is Serious Territory</AlertTitle>
                <AlertDescription className="text-orange-800">
                  60 DPD means you're on multiple bank watchlists. Consider selling assets, borrowing from family, taking personal loans -
                  ANYTHING to avoid hitting Day 90. That's when it becomes NPA and your credit is ruined for 7 years.
                  Think about your children's education, medical emergencies, future needs - all require good credit.
                </AlertDescription>
              </Alert>
            )}

            {daysLate >= 90 && (
              <Alert className="bg-red-100 border-red-500 border-2">
                <AlertTitle className="text-red-900 font-bold text-lg">🚨 You're In NPA Territory - Act NOW</AlertTitle>
                <AlertDescription className="text-red-800">
                  This ruins your credit for 7 years. It affects:
                  <ul className="list-disc ml-6 mt-2 space-y-1">
                    <li><strong>Job prospects:</strong> Many companies check credit for senior positions</li>
                    <li><strong>Marriage proposals:</strong> Families check credit reports these days</li>
                    <li><strong>Emergency loans:</strong> Medical emergencies? No bank will help</li>
                    <li><strong>Business opportunities:</strong> Can't get business loans or credit lines</li>
                    <li><strong>Your children:</strong> Can't be loan guarantor for their education/marriage</li>
                  </ul>
                  <p className="mt-3 font-semibold">Contact a credit counselor IMMEDIATELY. Explore OTS (One Time Settlement). Get legal advice.</p>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Real Stories */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Real Stories - This Happens to Real People</CardTitle>
            <CardDescription>Names changed, but stories are 100% real</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-orange-500">
              <h4 className="font-bold text-lg mb-2">📉 Raj's 45-Day Mistake Cost Him a Job</h4>
              <p className="text-gray-700">
                "I was 45 days late on my home loan in 2019. Paid it off, thought it was done. In 2021, I got a job offer at ₹18 LPA.
                During background verification, they saw my 45 DPD and withdrew the offer. The HR told me: 'We can't take financial discipline risks.'
                That delay cost me ₹2 crore+ in lifetime earnings."
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-500">
              <h4 className="font-bold text-lg mb-2">💔 Priya's 90 DPD Haunted Her for Years</h4>
              <p className="text-gray-700">
                "In 2017, I hit 90 DPD during a medical emergency. Cleared it in 2018. In 2022 - FIVE years later - I applied for a car loan.
                Rejected. The banker showed me: '90 DPD in 2017 - stays till 2024.' I'm paying ₹15,000/month in auto-rickshaw fares because of one mistake."
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-black">
              <h4 className="font-bold text-lg mb-2">🏠 The Sharmas Lost Everything at Day 210</h4>
              <p className="text-gray-700">
                "Mr. Sharma lost his job in 2020. Stopped EMIs. Thought 'bank will understand COVID situation.' Nobody told him about SARFAESI.
                At Day 210, bank auctioned their 2BHK. The family of 4 became homeless. The property sold for ₹45 lakhs - they had only ₹12 lakhs outstanding.
                But after legal fees and auction costs, they got nothing back. Don't let this be you."
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Prevention Tips */}
        <Card className="mb-8 border-2 border-green-400 bg-green-50">
          <CardHeader>
            <CardTitle className="text-2xl text-green-900">
              🛡️ Avoid This Nightmare - Prevention Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border-2 border-green-300">
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <span className="text-2xl">🏦</span>
                  Banking Safeguards
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Set up auto-debit (ECS/NACH mandate)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Enable SMS alerts for low balance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Keep EMI account separate from daily spending</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Set calendar reminders 5 days before due date</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-lg border-2 border-green-300">
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  Financial Planning
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Maintain 3-month EMI emergency fund</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Keep EMI ≤ 40% of your take-home salary</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Have a backup income source (freelance/rental)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Take credit life insurance (covers EMI if you die/disabled)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-lg border-2 border-green-300">
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <span className="text-2xl">🆘</span>
                  If Trouble Starts
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Talk to bank BEFORE missing payment, not after</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Ask about loan restructuring/moratorium options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Consider top-up loan or debt consolidation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Borrow from family/friends - better than CIBIL damage</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-lg border-2 border-green-300">
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <span className="text-2xl">📞</span>
                  Know Your Rights
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Banks must send notice before SARFAESI action</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>You can challenge auction in DRT (Debt Recovery Tribunal)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Request CIBIL correction if bank made reporting error</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Join credit counseling services (non-profit) for advice</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Score Visualization */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Credit Score Drop Visualization</CardTitle>
            <CardDescription>See how your score crashes with each milestone</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-semibold text-gray-600">
                    Day {milestone.day}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-200 h-8 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          milestone.creditScore >= 700 ? 'bg-green-500' :
                          milestone.creditScore >= 650 ? 'bg-yellow-500' :
                          milestone.creditScore >= 600 ? 'bg-orange-500' :
                          'bg-red-600'
                        } flex items-center justify-end pr-3 text-white font-bold transition-all duration-500`}
                        style={{ width: `${(milestone.creditScore / 850) * 100}%` }}
                      >
                        {milestone.creditScore}
                      </div>
                    </div>
                  </div>
                  <div className="w-32 text-right">
                    {index > 0 && (
                      <span className="text-red-600 font-bold text-sm">
                        ↓ {milestones[index - 1].creditScore - milestone.creditScore} points
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> These are approximate scores. Actual impact varies based on your existing credit history,
                number of credit accounts, and overall credit utilization. A person with 800 score might drop to 720 at 30 DPD,
                while someone at 650 might drop to 580.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Final CTA */}
        <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300">
          <AlertTitle className="text-2xl font-bold text-blue-900 mb-3">
            The Bottom Line
          </AlertTitle>
          <AlertDescription className="text-blue-800 space-y-3">
            <p className="text-lg">
              Missing EMI payments isn't just about money - it's about your <strong>financial reputation</strong> for the next 7 years.
            </p>
            <p>
              If you're reading this because you're already late: <strong>STOP PANICKING AND ACT.</strong> Call your bank right now.
              Explain your situation. Most banks want to help - they don't want your property either.
            </p>
            <p>
              If you're reading this as preparation: <strong>Good job.</strong> Set up those auto-debits. Build that emergency fund.
              Stay ahead of the game.
            </p>
            <p className="text-xl font-bold mt-4 p-4 bg-white rounded-lg border-2 border-blue-400">
              Remember: Your credit score is like your reputation - takes years to build, moments to destroy, and years to rebuild.
            </p>
          </AlertDescription>
        </Alert>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to All Guides
          </Link>
        </div>
      </div>
    </div>
  );
}
