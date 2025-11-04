"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Heart,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Shield,
  Target,
  DollarSign,
  FileText,
  Brain,
  XCircle,
  Home,
  Calculator,
  CreditCard,
  PiggyBank,
  Briefcase,
  Star,
  ArrowLeft,
  InfoIcon,
  Zap,
  Clock,
  Users,
  MessageCircle,
} from "lucide-react";

export default function TipsAndTricksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              Complete Home Loan Wisdom
            </h1>
            <p className="text-xl text-muted-foreground">
              Tips & Tricks from One Home Buyer to Another
            </p>
          </div>

          {/* Emotional Welcome */}
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Heart className="w-6 h-6 fill-green-600 text-green-600" />
                From One Home Buyer to Another
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                I remember my first home loan application. The forms, the documents, the scary numbers...
                My hands were literally shaking when I signed the loan agreement. ₹50 lakhs over 20 years?
                That&apos;s ₹6 lakhs a year! Would I even have a job for 20 years?
              </p>
              <p>
                If you&apos;re feeling scared right now - you&apos;re NORMAL. A home loan is probably the biggest
                financial commitment you&apos;ll ever make. But here&apos;s what I learned: knowledge removes fear.
                Understanding how it all works makes you feel in control.
              </p>
              <p className="font-medium">
                These tips are everything I wish someone had told me before I started. Read them, save them,
                come back to them whenever you need reassurance. You&apos;ve got this!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="before-loan" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
            <TabsTrigger value="before-loan" className="text-sm py-3">
              <FileText className="w-4 h-4 mr-2" />
              Before Loan
            </TabsTrigger>
            <TabsTrigger value="during-loan" className="text-sm py-3">
              <Clock className="w-4 h-4 mr-2" />
              During Loan
            </TabsTrigger>
            <TabsTrigger value="psychology" className="text-sm py-3">
              <Brain className="w-4 h-4 mr-2" />
              Psychology
            </TabsTrigger>
            <TabsTrigger value="mistakes" className="text-sm py-3">
              <XCircle className="w-4 h-4 mr-2" />
              Common Mistakes
            </TabsTrigger>
          </TabsList>

          {/* PART 1: Before Taking the Loan */}
          <TabsContent value="before-loan" className="space-y-6">
            <div className="mb-4">
              <h2 className="text-3xl font-bold mb-2">PART 1: Before Taking the Loan</h2>
              <p className="text-muted-foreground italic">Critical preparation that most people skip</p>
            </div>

            {/* Credit Score Section */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Target className="w-6 h-6" />
                  Credit Score: Your Golden Ticket
                </CardTitle>
                <CardDescription>
                  A difference of 50 points can mean 0.5% difference in interest rate.
                  On a ₹50L loan, that&apos;s ₹2-3 lakhs saved!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="credit-score">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        How to Check & Improve Your Credit Score
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          Free Credit Score Checks:
                        </h4>
                        <ul className="space-y-2 ml-7">
                          <li>• CIBIL: Once per year free at cibil.com</li>
                          <li>• OneScore app: Free unlimited checks</li>
                          <li>• Paytm/PhonePe: Free score in app</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Target Score:</h4>
                        <div className="space-y-2 ml-4">
                          <Badge variant="destructive" className="mr-2">&lt; 650</Badge>
                          <span>Banks will hesitate or charge higher rates</span>
                          <br />
                          <Badge variant="secondary" className="mr-2">650-749</Badge>
                          <span>Okay, but room for negotiation limited</span>
                          <br />
                          <Badge variant="default" className="mr-2 bg-yellow-500">750-900</Badge>
                          <span className="font-semibold">GOLDEN ZONE - banks compete for you!</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-amber-600" />
                          Quick Fixes (if score is low):
                        </h4>
                        <ol className="space-y-2 ml-7 list-decimal">
                          <li>Pay off credit cards (6-8 weeks to reflect)</li>
                          <li>Dispute errors (check report carefully - mistakes are common!)</li>
                          <li>Don&apos;t apply to multiple banks simultaneously (each inquiry hurts score)</li>
                          <li>Keep old credit cards active (longer credit history = better)</li>
                          <li>Use &lt; 30% of credit limit (High utilization hurts score)</li>
                          <li>Clear any outstanding dues immediately</li>
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Timeline:</h4>
                        <ul className="space-y-2 ml-7">
                          <li>• Start checking 6 months before loan application</li>
                          <li>• Give yourself 3 months to fix any issues</li>
                          <li>• Re-check before applying</li>
                        </ul>
                      </div>

                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Common Mistake:</strong> People check their score for the first time AFTER loan rejection.
                          Don&apos;t be that person! Check NOW.
                        </AlertDescription>
                      </Alert>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Down Payment Section */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <PiggyBank className="w-6 h-6" />
                  Down Payment: The Optimal Amount
                </CardTitle>
                <CardDescription>
                  Bank Requirement: Minimum 20% (₹10L on ₹50L property)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="down-payment">
                    <AccordionTrigger className="text-lg font-semibold">
                      Why 30-35% is Actually Optimal
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        {/* Option A */}
                        <Card className="border-amber-200">
                          <CardHeader>
                            <CardTitle className="text-base">Option A: 20% Down</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <p>₹10L down payment</p>
                            <p>• Loan: ₹40L</p>
                            <p>• EMI: Higher</p>
                            <p>• Interest: Maximum</p>
                            <p>• Approval: Tougher (80% LTV risky)</p>
                          </CardContent>
                        </Card>

                        {/* Option B - Recommended */}
                        <Card className="border-green-500 border-2 bg-green-50">
                          <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                              Option B: 30% Down
                              <Badge variant="default" className="bg-green-600">Recommended</Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <p className="font-semibold">₹15L down payment</p>
                            <p>• Loan: ₹35L (₹5L less)</p>
                            <p>• EMI: ₹6,000-7,000 lower/month</p>
                            <p>• Interest saved: ₹8-12L over life</p>
                            <p>• Approval: Much easier</p>
                            <p className="font-semibold text-green-700">• Banks may offer 0.10-0.25% lower rate!</p>
                          </CardContent>
                        </Card>

                        {/* Option C */}
                        <Card className="border-red-200">
                          <CardHeader>
                            <CardTitle className="text-base">Option C: 40%+ Down</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <p>₹20L+ down payment</p>
                            <p>• EMI: Even lower</p>
                            <p>• But: Kills liquidity</p>
                            <p>• Emergency fund: Zero</p>
                            <p className="text-red-600 font-semibold">• Not recommended unless rich!</p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-3">The Math:</h4>
                        <ul className="space-y-2">
                          <li>• Every ₹1L extra in down payment = ₹1,700-2,000 less EMI</li>
                          <li>• That ₹5L extra down payment = ₹10,000 less EMI</li>
                          <li>• Over 20 years, that ₹5L becomes ₹10L+ saving</li>
                        </ul>
                      </div>

                      <Alert className="border-green-500 bg-green-50">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription>
                          <strong className="text-green-700">Pro Strategy:</strong> If you have ₹20L saved for ₹50L property:
                          <ul className="mt-2 space-y-1 ml-4">
                            <li>• Pay ₹15L down payment (30%)</li>
                            <li>• Keep ₹5L as emergency fund</li>
                            <li>• Prepay ₹1-2L per year from this fund</li>
                          </ul>
                          <p className="mt-2 font-semibold">This gives you BOTH - lower loan AND liquidity!</p>
                        </AlertDescription>
                      </Alert>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Negotiation Section */}
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <MessageCircle className="w-6 h-6" />
                  Negotiation: How to Get 0.25-0.50% Lower Rate
                </CardTitle>
                <CardDescription>
                  Most people don&apos;t know: Interest rates are NEGOTIABLE!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="negotiation">
                    <AccordionTrigger className="text-lg font-semibold">
                      Negotiation Tactics That Actually Work
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3">Step 1: Get Competing Quotes (3 banks minimum)</h4>
                        <ul className="space-y-2 ml-7">
                          <li>• Don&apos;t just ask for rates online</li>
                          <li>• Visit branch, talk to loan officer</li>
                          <li>• Get formal quote in writing (or email)</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Step 2: Leverage Your Profile</h4>
                        <p className="mb-2">Things banks LOVE:</p>
                        <div className="grid md:grid-cols-2 gap-2 ml-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span>High credit score (750+)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span>Stable job (3+ years)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span>Higher down payment (30%+)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span>Existing relationship</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span>Professional qualifications</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h4 className="font-semibold mb-3">Step 3: The Negotiation Script</h4>
                        <blockquote className="italic border-l-4 border-purple-500 pl-4 py-2">
                          &quot;I&apos;m comparing offers from HDFC, SBI, and ICICI. HDFC offered me 8.40% with 0.25% processing fee.
                          I prefer your bank because [genuine reason], but I need you to match or beat that rate.
                          Can you do 8.35% or waive the processing fee?&quot;
                        </blockquote>
                        <div className="mt-3">
                          <p className="font-semibold mb-2">Why this works:</p>
                          <ul className="space-y-1 text-sm ml-4">
                            <li>• You&apos;re not being aggressive, just practical</li>
                            <li>• You&apos;re showing you&apos;ve done homework</li>
                            <li>• You&apos;re giving them a target to beat</li>
                            <li>• You&apos;re expressing preference (makes them want your business)</li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Clock className="w-5 h-5 text-blue-600" />
                          Step 4: Timing is Everything
                        </h4>
                        <p className="mb-2">Best times to negotiate:</p>
                        <div className="grid md:grid-cols-2 gap-2 ml-4">
                          <div>📅 End of month (targets pressure)</div>
                          <div>📅 End of quarter (March, June, Sept, Dec)</div>
                          <div>📅 Festival seasons (Diwali, New Year)</div>
                          <div>📅 Bank anniversary months</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Step 5: What&apos;s Actually Negotiable</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span>Interest rate: 0.10-0.50% possible</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span>Processing fee: Can get 50% off or waived</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span>Technical/legal charges: Often waived</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-600" />
                            <span>Stamp duty & registration: Government fees, non-negotiable</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-amber-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Real Example:</h4>
                        <ul className="space-y-1">
                          <li>• Bank&apos;s initial offer: 8.60% + 0.50% processing fee</li>
                          <li>• After negotiation: 8.45% + 0.25% processing fee</li>
                          <li className="font-semibold text-green-700">• Savings: ₹4-5 lakhs over 20 years!</li>
                        </ul>
                      </div>

                      <Alert className="border-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
                        <Heart className="h-4 w-4 text-green-600 fill-green-600" />
                        <AlertDescription>
                          <strong className="text-green-700">Don&apos;t Be Shy!</strong>
                          <p className="mt-2">
                            I know, Indians don&apos;t like to haggle for financial products. We think rates are &quot;fixed&quot;.
                            But banks negotiate car loans, personal loans - why not home loans?
                          </p>
                          <p className="mt-2 font-semibold">
                            That 15 minutes of slightly uncomfortable conversation can save you ₹5 lakhs. Your family
                            deserves that money more than the bank does. Be polite, be professional, but NEGOTIATE!
                          </p>
                        </AlertDescription>
                      </Alert>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Hidden Charges Section */}
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <DollarSign className="w-6 h-6" />
                  Hidden Charges: The Complete Checklist
                </CardTitle>
                <CardDescription>
                  The advertised rate is NEVER the full cost. Here&apos;s what they don&apos;t tell you upfront
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="hidden-charges">
                    <AccordionTrigger className="text-lg font-semibold">
                      Complete Hidden Charges Breakdown
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-semibold">1. Processing Fee</h4>
                          <ul className="text-sm space-y-1 mt-2">
                            <li>• Typical: 0.25-0.50% of loan amount + 18% GST</li>
                            <li>• On ₹40L loan: ₹10,000-20,000 + GST = ₹12,000-24,000</li>
                            <li className="text-green-600 font-medium">• Often negotiable! Ask for waiver or 50% off</li>
                          </ul>
                        </div>

                        <div className="border-l-4 border-purple-500 pl-4">
                          <h4 className="font-semibold">2. Login Fees / Administration Charges</h4>
                          <ul className="text-sm space-y-1 mt-2">
                            <li>• Some banks: ₹5,000-10,000 one-time</li>
                            <li>• For what? Nobody knows 😅</li>
                            <li className="text-green-600 font-medium">• Try to get this waived</li>
                          </ul>
                        </div>

                        <div className="border-l-4 border-green-500 pl-4">
                          <h4 className="font-semibold">3. Technical & Legal Fees</h4>
                          <ul className="text-sm space-y-1 mt-2">
                            <li>• Property valuation: ₹3,000-5,000</li>
                            <li>• Legal verification: ₹5,000-8,000</li>
                            <li>• Sometimes bundled, sometimes separate</li>
                            <li className="text-green-600 font-medium">• Sometimes waived for &quot;premium&quot; customers</li>
                          </ul>
                        </div>

                        <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-3 rounded">
                          <h4 className="font-semibold text-red-700">4. Stamp Duty & Registration</h4>
                          <ul className="text-sm space-y-1 mt-2">
                            <li className="font-semibold">• BIGGEST COST after down payment</li>
                            <li>• 5-7% of property value (varies by state)</li>
                            <li>• Maharashtra: 5%, Karnataka: 5%, UP: 7%</li>
                            <li>• On ₹50L property: ₹2.5-3.5 lakhs!</li>
                            <li className="text-green-600 font-medium">• Pro tip: Register in wife&apos;s name (1-2% discount in many states)</li>
                          </ul>
                        </div>

                        <div className="border-l-4 border-amber-500 pl-4">
                          <h4 className="font-semibold">5. Pre-EMI Interest (for under-construction)</h4>
                          <ul className="text-sm space-y-1 mt-2">
                            <li>• If buying under-construction property</li>
                            <li>• You pay ONLY interest until possession</li>
                            <li>• Can add up to several lakhs</li>
                            <li className="text-amber-600 font-medium">• Factor this into your budget!</li>
                          </ul>
                        </div>

                        <div className="border-l-4 border-indigo-500 pl-4">
                          <h4 className="font-semibold">6. Insurance</h4>
                          <ul className="text-sm space-y-1 mt-2">
                            <li>• Banks push home loan insurance</li>
                            <li>• Typical: ₹10,000-20,000 per year</li>
                            <li className="text-green-600 font-medium">• You can say NO (for floating rate loans)</li>
                            <li>• Or buy cheaper term insurance separately</li>
                          </ul>
                        </div>

                        <div className="border-l-4 border-pink-500 pl-4">
                          <h4 className="font-semibold">7. Prepayment Charges (Read fine print!)</h4>
                          <ul className="text-sm space-y-1 mt-2">
                            <li>• Floating rate: Usually NIL</li>
                            <li>• Fixed rate: Often 2-4%!</li>
                            <li className="text-blue-600 font-medium">• This is why floating rate is preferred</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <h4 className="font-semibold mb-3">Total Hidden Costs Example:</h4>
                        <table className="w-full text-sm">
                          <tbody className="space-y-1">
                            <tr>
                              <td>Processing:</td>
                              <td className="text-right">₹15,000</td>
                            </tr>
                            <tr>
                              <td>Login:</td>
                              <td className="text-right">₹5,000</td>
                            </tr>
                            <tr>
                              <td>Technical/Legal:</td>
                              <td className="text-right">₹8,000</td>
                            </tr>
                            <tr>
                              <td>Stamp duty:</td>
                              <td className="text-right">₹3,00,000</td>
                            </tr>
                            <tr className="border-t-2 font-bold text-base">
                              <td>TOTAL:</td>
                              <td className="text-right">₹3,28,000</td>
                            </tr>
                          </tbody>
                        </table>
                        <p className="text-xs mt-2 text-muted-foreground">on top of down payment!</p>
                      </div>

                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>CRITICAL WARNING:</strong>
                          <p className="mt-2">
                            Budget for these hidden costs BEFORE starting property search. I&apos;ve seen people who had
                            exactly ₹15L saved, found ₹50L property, thought &quot;perfect, 30% down payment&quot; - then
                            discovered they needed ₹18.5L (₹15L + ₹3.5L hidden costs)!
                          </p>
                          <p className="mt-2 font-semibold">
                            Don&apos;t let this be you. Budget: Property cost + 7-8% for all hidden charges.
                          </p>
                        </AlertDescription>
                      </Alert>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PART 2: During Loan Tenure */}
          <TabsContent value="during-loan" className="space-y-6">
            <div className="mb-4">
              <h2 className="text-3xl font-bold mb-2">PART 2: During Your Loan Tenure</h2>
              <p className="text-muted-foreground italic">Once the loan is running - how to manage it smartly</p>
            </div>

            {/* Prepayment Strategy */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <TrendingUp className="w-6 h-6" />
                  Prepayment Strategy: When, How Much, and Why
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="prepayment">
                    <AccordionTrigger className="text-lg font-semibold">
                      The Golden Rule: Prepay in First 5 Years for Maximum Impact
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Why first 5 years?</h4>
                        <ul className="space-y-1">
                          <li>• In early years, 70-80% of EMI is INTEREST</li>
                          <li>• Later years, 70-80% is principal</li>
                          <li>• Every ₹1 prepaid in Year 1 saves ₹2.50 in interest</li>
                          <li>• Same ₹1 in Year 15 saves only ₹0.30</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          When TO Prepay:
                        </h4>
                        <div className="grid md:grid-cols-2 gap-2 ml-4">
                          <div>✅ After receiving bonus</div>
                          <div>✅ Tax refund received</div>
                          <div>✅ Inherited money</div>
                          <div>✅ When interest rates are falling</div>
                          <div>✅ March (before FY end for tax benefit)</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <XCircle className="w-5 h-5 text-red-600" />
                          When NOT to Prepay:
                        </h4>
                        <div className="grid md:grid-cols-2 gap-2 ml-4">
                          <div>❌ If you have higher-interest debt</div>
                          <div>❌ If you have zero emergency fund</div>
                          <div>❌ If you can invest at 10-12% post-tax</div>
                          <div>❌ If property prices are falling</div>
                          <div>❌ In last 5 years of loan (minimal impact)</div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">How Much to Prepay:</h4>
                        <ul className="space-y-1">
                          <li>• <strong>Minimum:</strong> Whatever you can spare</li>
                          <li>• <strong>Optimal:</strong> ₹1-2 lakhs per year</li>
                          <li>• <strong>Maximum:</strong> Keep 6 months emergency fund before prepaying aggressively</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Prepayment Options:</h4>
                        <p className="mb-3 text-sm text-muted-foreground">When you prepay, bank asks: Reduce tenure or EMI?</p>

                        <div className="grid md:grid-cols-2 gap-4">
                          <Card className="border-green-500 border-2 bg-green-50">
                            <CardHeader>
                              <CardTitle className="text-base flex items-center gap-2">
                                Option A: Reduce Tenure
                                <Badge variant="default" className="bg-green-600">Recommended</Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1 text-sm">
                              <p>• Same EMI continues</p>
                              <p>• Loan closes earlier</p>
                              <p className="font-semibold text-green-700">• Saves maximum interest</p>
                            </CardContent>
                          </Card>

                          <Card className="border-amber-200">
                            <CardHeader>
                              <CardTitle className="text-base">Option B: Reduce EMI</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1 text-sm">
                              <p>• Lower monthly payment</p>
                              <p>• Same loan duration</p>
                              <p>• Saves less interest</p>
                              <p className="text-amber-600">• Choose only if you need cash flow relief</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      <Alert className="border-green-500 bg-green-50">
                        <Star className="h-4 w-4 text-green-600" />
                        <AlertDescription>
                          <strong className="text-green-700">March Prepayment Trick:</strong>
                          <p className="mt-2">
                            Prepay ₹1.5L in March → File ITR in April → Get ₹45K refund by July → Prepay again in August!
                          </p>
                          <p className="mt-2 font-semibold">
                            This way, you&apos;re accelerating your prepayment cycle and using tax money twice!
                          </p>
                        </AlertDescription>
                      </Alert>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Tax Optimization */}
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Calculator className="w-6 h-6" />
                  Tax Benefits & Optimization
                </CardTitle>
                <CardDescription>
                  Maximize your tax savings with proper planning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Available Tax Deductions:</h4>
                  <div className="space-y-3">
                    <div className="border-l-4 border-purple-500 pl-4">
                      <p className="font-semibold">Section 80C (Principal Repayment)</p>
                      <p className="text-sm">Up to ₹1.5 lakhs deduction per year</p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <p className="font-semibold">Section 24(b) (Interest Payment)</p>
                      <p className="text-sm">Up to ₹2 lakhs deduction per year</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <p className="font-semibold">First-time Buyer Benefit (Section 80EEA)</p>
                      <p className="text-sm">Additional ₹1.5 lakhs on interest (if eligible)</p>
                    </div>
                  </div>
                </div>

                <Alert className="border-blue-500 bg-blue-50">
                  <InfoIcon className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <strong>Old vs New Tax Regime:</strong>
                    <p className="mt-2">
                      Home loan tax benefits are only available in the OLD tax regime. If you&apos;re in the new regime,
                      you won&apos;t get these deductions. Calculate which regime is better for you!
                    </p>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PART 3: Psychology & Mindset */}
          <TabsContent value="psychology" className="space-y-6">
            <div className="mb-4">
              <h2 className="text-3xl font-bold mb-2">PART 3: Psychological Guidance</h2>
              <p className="text-muted-foreground italic">The emotional journey that nobody talks about</p>
            </div>

            {/* Emotional Message */}
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Heart className="w-6 h-6 fill-green-600 text-green-600" />
                  Let&apos;s Talk About the Stress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Home loan stress is REAL. It&apos;s not just about money - it&apos;s about:</p>
                <ul className="space-y-2 ml-6">
                  <li>• Fear of job loss</li>
                  <li>• Pressure of monthly EMI</li>
                  <li>• &quot;Did I buy at the right time?&quot;</li>
                  <li>• &quot;Will I be paying this for 20 years?&quot;</li>
                  <li>• Family pressure</li>
                  <li>• Societal expectations</li>
                </ul>
                <p className="font-semibold">
                  If you&apos;re feeling any of this - YOU&apos;RE NORMAL. Let&apos;s address it properly.
                </p>
              </CardContent>
            </Card>

            {/* Managing Stress */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Brain className="w-6 h-6" />
                  Managing Home Loan Stress & Anxiety
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="stress">
                    <AccordionTrigger className="text-lg font-semibold">
                      Practical Strategies for Peace of Mind
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6">
                      {/* 40% Rule */}
                      <div>
                        <h4 className="font-semibold mb-3">The 40% Rule for Peace of Mind</h4>
                        <p className="mb-3">EMI should NEVER exceed 40% of take-home salary</p>
                        <div className="space-y-2">
                          <div className="flex items-start gap-3">
                            <Badge variant="default" className="bg-green-500">20-25%</Badge>
                            <div>
                              <strong>Comfortable</strong> - You can save, invest, enjoy life
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Badge variant="default" className="bg-blue-500">30-35%</Badge>
                            <div>
                              <strong>Manageable</strong> - Tight but doable
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Badge variant="default" className="bg-amber-500">40-45%</Badge>
                            <div>
                              <strong>Stressful</strong> - Think twice
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Badge variant="destructive">50%+</Badge>
                            <div>
                              <strong>Dangerous</strong> - Lifestyle squeeze, one emergency away from default
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mental Accounting */}
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-3">Mental Accounting Trick</h4>
                        <p className="mb-2">Don&apos;t think of EMI as &quot;throwing money away&quot;</p>
                        <p className="mb-3 font-semibold">Think of it as: &quot;Paying rent to future-me&quot;</p>
                        <ul className="space-y-2">
                          <li>• Interest component = Rent for using bank&apos;s money</li>
                          <li>• Principal component = Savings in your own property</li>
                        </ul>
                        <p className="mt-3 text-sm font-medium">
                          Track the principal component - it grows every month! That&apos;s YOUR money building YOUR asset.
                        </p>
                      </div>

                      {/* Milestone Approach */}
                      <div>
                        <h4 className="font-semibold mb-3">Milestone Approach (Gamify Your Loan!)</h4>
                        <p className="mb-3">Celebrate these milestones:</p>
                        <div className="space-y-2 ml-4">
                          <div>🎉 Year 2: Crossed ₹2L principal paid</div>
                          <div>🎉 Year 5: 20% loan paid off</div>
                          <div>🎉 Year 10: HALFWAY DONE! Big celebration!</div>
                          <div>🎉 Year 15: 70% paid (tipping point - principal now exceeds interest)</div>
                          <div>🎉 Final Payment: FREEDOM DAY!</div>
                        </div>
                      </div>

                      {/* Visualization */}
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-3">Visualization Exercise</h4>
                        <ol className="space-y-2 list-decimal ml-6">
                          <li>Print your amortization schedule</li>
                          <li>Highlight when principal exceeds interest (usually year 12-15)</li>
                          <li>Mark off each completed year</li>
                          <li>See the outstanding balance shrinking</li>
                          <li><strong>Feel the progress!</strong></li>
                        </ol>
                      </div>

                      {/* 5 Years Forward */}
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-3">The &quot;5 Years Forward&quot; Perspective</h4>
                        <p className="mb-2">Feeling overwhelmed by 20 years?</p>
                        <p className="mb-3 font-semibold">Don&apos;t think 20 years ahead. Think 5 years ahead.</p>
                        <p className="mb-2">In 5 years:</p>
                        <ul className="space-y-1 ml-4">
                          <li>• Your salary will likely double</li>
                          <li>• EMI will feel much smaller</li>
                          <li>• You&apos;ll have prepaid ₹5-10L (if smart)</li>
                          <li>• Loan will seem manageable</li>
                        </ul>
                        <p className="mt-3 font-semibold">Just focus on the next 5 years. Then reassess.</p>
                      </div>

                      {/* When to Seek Help */}
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>When to Seek Help:</strong>
                          <p className="mt-2">If your home loan is causing:</p>
                          <ul className="mt-2 space-y-1 ml-4">
                            <li>• Sleep problems</li>
                            <li>• Relationship stress</li>
                            <li>• Constant anxiety</li>
                            <li>• Avoiding social situations</li>
                          </ul>
                          <div className="mt-3 space-y-1">
                            <p>→ Talk to a financial counselor</p>
                            <p>→ Consider restructuring loan</p>
                            <p>→ It&apos;s okay to extend tenure if needed for peace of mind</p>
                          </div>
                        </AlertDescription>
                      </Alert>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PART 4: Common Mistakes */}
          <TabsContent value="mistakes" className="space-y-6">
            <div className="mb-4">
              <h2 className="text-3xl font-bold mb-2">PART 4: Common Mistakes</h2>
              <p className="text-muted-foreground italic">Learn from others&apos; mistakes - don&apos;t repeat them!</p>
            </div>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <XCircle className="w-6 h-6" />
                  10 Common Mistakes First-Time Buyers Make
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {/* Mistake 1 */}
                  <AccordionItem value="mistake-1">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-start gap-2">
                        <Badge variant="destructive">1</Badge>
                        <span>Buying Based on Max Approved Amount</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <p>Bank approves ₹80L → DON&apos;T buy ₹80L property!</p>
                      <div className="bg-red-50 p-3 rounded">
                        <p className="font-semibold">Bank&apos;s job: Lend maximum</p>
                        <p className="font-semibold">Your job: Borrow smartly</p>
                      </div>
                      <Alert className="border-green-500 bg-green-50">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription>
                          <strong>Rule:</strong> Buy 20-25% below max approved amount
                        </AlertDescription>
                      </Alert>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Mistake 2 */}
                  <AccordionItem value="mistake-2">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-start gap-2">
                        <Badge variant="destructive">2</Badge>
                        <span>Ignoring Maintenance Costs</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <p className="font-semibold">Property cost ≠ Total cost of ownership</p>
                      <ul className="space-y-2 ml-4">
                        <li>• Apartment: ₹3-5K/month (maintenance, repairs)</li>
                        <li>• Villa: ₹5-10K/month</li>
                        <li>• Society charges: ₹2-4K/month</li>
                        <li>• Property tax: Annual</li>
                      </ul>
                      <p className="font-semibold text-red-600">These add up to ₹5-10K/month extra!</p>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Mistake 3 */}
                  <AccordionItem value="mistake-3">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-start gap-2">
                        <Badge variant="destructive">3</Badge>
                        <span>Not Reading Fine Print</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      <ul className="space-y-2 ml-4">
                        <li>• &quot;Floating rate&quot;: Can increase (it has, multiple times)</li>
                        <li>• &quot;Subvention scheme&quot;: Builder pays interest during construction (but adds to cost)</li>
                        <li>• &quot;Possession date&quot;: Delays are common (keep renting for 6 months buffer)</li>
                        <li>• &quot;Prepayment allowed&quot;: Check frequency limits</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Mistake 4 */}
                  <AccordionItem value="mistake-4">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-start gap-2">
                        <Badge variant="destructive">4</Badge>
                        <span>Over-Leveraging on Future Income</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <div>
                        <p className="font-semibold mb-2">Common assumptions:</p>
                        <ul className="space-y-1 ml-4">
                          <li>• &quot;I&apos;ll get 10% increment every year&quot;</li>
                          <li>• &quot;My spouse will start working&quot;</li>
                          <li>• &quot;I&apos;ll get promoted&quot;</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold mb-2">Reality:</p>
                        <ul className="space-y-1 ml-4">
                          <li>• Layoffs happen</li>
                          <li>• Companies fail</li>
                          <li>• Job switches mean salary resets</li>
                          <li>• Spouse&apos;s career may not pan out</li>
                        </ul>
                      </div>
                      <Alert className="border-amber-500 bg-amber-50">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <AlertDescription>
                          <strong>Plan EMI based on CURRENT income, not future dreams</strong>
                        </AlertDescription>
                      </Alert>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Mistake 5 */}
                  <AccordionItem value="mistake-5">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-start gap-2">
                        <Badge variant="destructive">5</Badge>
                        <span>Skipping Emergency Fund</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <p className="font-semibold">Home loan ≠ Permission to empty savings account</p>
                      <div className="bg-amber-50 p-3 rounded">
                        <p className="font-semibold mb-2">Before aggressive prepayment, maintain:</p>
                        <ul className="space-y-1 ml-4">
                          <li>• 6 months living expenses in liquid fund</li>
                          <li>• 6 months EMI amount separate</li>
                          <li>• ₹2-3L for home repairs/furnishing</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Mistake 6 */}
                  <AccordionItem value="mistake-6">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-start gap-2">
                        <Badge variant="destructive">6</Badge>
                        <span>Buying Under-Construction Without Research</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <p>Builder promises 2-year delivery → Often becomes 4-5 years</p>
                      <div>
                        <p className="font-semibold mb-2">What happens:</p>
                        <ul className="space-y-1 ml-4">
                          <li>• You pay rent + pre-EMI (double whammy)</li>
                          <li>• Costs add up</li>
                          <li>• Mental stress</li>
                        </ul>
                      </div>
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="font-semibold mb-2">Due diligence:</p>
                        <ul className="space-y-1 ml-4">
                          <li>• Check builder&apos;s track record</li>
                          <li>• Visit previous projects</li>
                          <li>• Check RERA registration</li>
                          <li>• Talk to existing customers</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Mistake 7 */}
                  <AccordionItem value="mistake-7">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-start gap-2">
                        <Badge variant="destructive">7</Badge>
                        <span>Ignoring Location Growth Potential</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <p className="font-semibold">₹50L in developing area vs ₹50L in established area</p>
                      <div>
                        <p className="mb-2">Consider:</p>
                        <ul className="space-y-1 ml-4">
                          <li>• Will metro/highway come nearby? (10-15% appreciation)</li>
                          <li>• Are companies setting up offices? (Employment = demand)</li>
                          <li>• School, hospital, mall coming up?</li>
                        </ul>
                      </div>
                      <p className="font-semibold text-green-600 mt-3">Location &gt; Property size/features</p>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Mistake 8 */}
                  <AccordionItem value="mistake-8">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-start gap-2">
                        <Badge variant="destructive">8</Badge>
                        <span>Not Comparing Multiple Banks</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <p>First bank you visit might not be the best</p>
                      <p className="font-semibold text-red-600">0.5% rate difference = ₹4-5 lakhs over 20 years!</p>
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="font-semibold mb-2">Visit minimum 3 banks, compare:</p>
                        <ul className="space-y-1 ml-4">
                          <li>• Interest rate</li>
                          <li>• Processing fee</li>
                          <li>• Prepayment flexibility</li>
                          <li>• Online servicing</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Mistake 9 */}
                  <AccordionItem value="mistake-9">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-start gap-2">
                        <Badge variant="destructive">9</Badge>
                        <span>Buying Too Early in Career</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <p>Age 23-25, just got first job → Buying home? Maybe wait.</p>
                      <div>
                        <p className="font-semibold mb-2">Why:</p>
                        <ul className="space-y-1 ml-4">
                          <li>• Job stability unknown</li>
                          <li>• May need to relocate</li>
                          <li>• Salary will jump significantly in 3-5 years</li>
                          <li>• Can get better property later</li>
                        </ul>
                      </div>
                      <p className="font-semibold text-green-600 mt-3">Ideal age: 28-35 (unless special circumstances)</p>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Mistake 10 */}
                  <AccordionItem value="mistake-10">
                    <AccordionTrigger className="text-left">
                      <div className="flex items-start gap-2">
                        <Badge variant="destructive">10</Badge>
                        <span>Not Using Professional Help</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <p>&quot;I&apos;ll handle it myself&quot; → Misses tax benefits, negotiation leverage, legal issues</p>
                      <div className="bg-green-50 p-3 rounded">
                        <p className="font-semibold mb-2">Worth hiring:</p>
                        <ul className="space-y-2 ml-4">
                          <li>• <strong>Property lawyer (₹10-15K):</strong> Can save lakhs in legal issues</li>
                          <li>• <strong>Financial advisor (₹5-10K):</strong> Tax optimization alone recovers fee</li>
                          <li>• <strong>Property inspector (₹5K):</strong> Finds structural issues before purchase</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* The Biggest Mistake */}
            <Alert variant="destructive" className="border-red-500">
              <Heart className="h-5 w-5" />
              <AlertDescription>
                <strong className="text-lg">The Biggest Mistake of All:</strong>
                <div className="mt-3 space-y-2">
                  <p><strong>Buying because &quot;everyone else is buying&quot;</strong></p>
                  <p><strong>Buying because &quot;prices will rise forever&quot;</strong></p>
                  <p><strong>Buying because &quot;parents are pressuring&quot;</strong></p>
                </div>
                <p className="mt-4 font-semibold">
                  A home is a 20-year commitment. Make sure YOU want it, YOU can afford it, and YOU are
                  mentally prepared for the responsibility. Don&apos;t let FOMO or societal pressure drive the
                  biggest financial decision of your life.
                </p>
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        {/* Bottom Navigation */}
        <Card className="mt-8 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Ready to Put This Knowledge into Action?</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Link href="/strategies">
                    <Calculator className="w-4 h-4 mr-2" />
                    Explore Strategies
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
