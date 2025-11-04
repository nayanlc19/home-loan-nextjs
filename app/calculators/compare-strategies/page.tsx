"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import {
  ArrowLeft,
  Trophy,
  TrendingDown,
  Clock,
  DollarSign,
  Download,
  CheckCircle2,
  AlertCircle,
  Zap,
  Target,
  Award,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  calculateEMI,
  calculateTotalInterest,
  calculateBiWeeklyImpact,
  calculateStepUpEMI,
  calculatePrepaymentImpact,
  formatIndianCurrency,
  generateAmortizationSchedule,
} from "@/lib/loan-utils";
import {
  calculateHomeLoanTaxBenefits,
  calculateTaxOnIncome,
  type TaxRegime,
} from "@/lib/tax-utils";

// Strategy definitions
const ALL_STRATEGIES = [
  { id: "biweekly", name: "Bi-Weekly Payment Hack", difficulty: "Easy" },
  { id: "taxrefund", name: "Tax Refund Amplification", difficulty: "Easy" },
  { id: "lumpsum", name: "Lump Sum Accelerator", difficulty: "Medium" },
  { id: "stepup", name: "Step-Up EMI Plan", difficulty: "Easy" },
  { id: "prepayment", name: "Part-Prepayment Strategy", difficulty: "Medium" },
  { id: "balancetransfer", name: "Balance Transfer", difficulty: "Medium" },
];

const CHART_COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

interface StrategyInputs {
  biweekly: {};
  taxrefund: { annualRefund: number };
  lumpsum: { prepaymentAmount: number; year: number };
  stepup: { annualIncrease: number };
  prepayment: { prepaymentAmount: number; reduceTenure: boolean };
  balancetransfer: { newRate: number; processingFees: number };
}

interface StrategyResult {
  id: string;
  name: string;
  difficulty: string;
  totalInterest: number;
  interestSaved: number;
  taxBenefitsYear1: number;
  netBenefit: number;
  timeSaved: number;
  newTenure: number;
  cashFlowImpact: string;
  flexibility: string;
}

export default function CompareStrategiesPage() {
  // Common inputs
  const [loanAmount, setLoanAmount] = useState(5000000); // 50L
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [taxSlab, setTaxSlab] = useState(30);
  const [taxRegime, setTaxRegime] = useState<TaxRegime>("old");

  // Selected strategies
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);

  // Strategy-specific inputs
  const [strategyInputs, setStrategyInputs] = useState<StrategyInputs>({
    biweekly: {},
    taxrefund: { annualRefund: 100000 },
    lumpsum: { prepaymentAmount: 500000, year: 5 },
    stepup: { annualIncrease: 5 },
    prepayment: { prepaymentAmount: 200000, reduceTenure: true },
    balancetransfer: { newRate: 7.5, processingFees: 10000 },
  });

  const [activeTab, setActiveTab] = useState("select");

  // Toggle strategy selection
  const toggleStrategy = (strategyId: string) => {
    setSelectedStrategies((prev) => {
      if (prev.includes(strategyId)) {
        return prev.filter((id) => id !== strategyId);
      } else {
        if (prev.length >= 4) {
          return prev;
        }
        return [...prev, strategyId];
      }
    });
  };

  // Calculate baseline
  const baseline = useMemo(() => {
    const totalInterest = calculateTotalInterest(loanAmount, interestRate, tenure);
    const emi = calculateEMI(loanAmount, interestRate, tenure);

    // Calculate first year tax benefits
    const schedule = generateAmortizationSchedule({
      principal: loanAmount,
      annualRate: interestRate,
      tenureYears: tenure,
    });

    const firstYearInterest = schedule.months
      .slice(0, 12)
      .reduce((sum, m) => sum + m.interest, 0);
    const firstYearPrincipal = schedule.months
      .slice(0, 12)
      .reduce((sum, m) => sum + m.principal, 0);

    // Estimate taxable income from tax slab
    const estimatedIncome = taxSlab === 30 ? 1500000 : taxSlab === 20 ? 800000 : 400000;

    const taxBenefits = calculateHomeLoanTaxBenefits(
      firstYearPrincipal,
      firstYearInterest,
      estimatedIncome,
      "self-occupied",
      taxRegime
    );

    return {
      emi,
      totalInterest,
      tenure,
      taxBenefitsYear1: taxBenefits.totalBenefit,
    };
  }, [loanAmount, interestRate, tenure, taxSlab, taxRegime]);

  // Calculate results for each selected strategy
  const strategyResults = useMemo((): StrategyResult[] => {
    const estimatedIncome = taxSlab === 30 ? 1500000 : taxSlab === 20 ? 800000 : 400000;

    return selectedStrategies.map((strategyId) => {
      let totalInterest = 0;
      let newTenure = tenure;
      let timeSaved = 0;
      let cashFlowImpact = "Low";
      let flexibility = "Medium";
      let firstYearInterest = 0;
      let firstYearPrincipal = 0;

      const strategy = ALL_STRATEGIES.find((s) => s.id === strategyId)!;

      switch (strategyId) {
        case "biweekly": {
          const result = calculateBiWeeklyImpact(loanAmount, interestRate, tenure);
          totalInterest = baseline.totalInterest - result.interestSaved;
          newTenure = result.newTenure;
          timeSaved = result.timeSaved;
          cashFlowImpact = "Low";
          flexibility = "Medium";

          // Calculate first year for bi-weekly
          const schedule = generateAmortizationSchedule({
            principal: loanAmount,
            annualRate: interestRate,
            tenureYears: tenure,
          });
          firstYearInterest = schedule.months.slice(0, 12).reduce((sum, m) => sum + m.interest, 0);
          firstYearPrincipal = schedule.months.slice(0, 12).reduce((sum, m) => sum + m.principal, 0);
          firstYearPrincipal += result.monthlyEmi; // Extra payment
          break;
        }

        case "taxrefund": {
          const { annualRefund } = strategyInputs.taxrefund;
          // Annual prepayment with tax refund
          const prepayments = Array.from({ length: tenure }, (_, i) => ({
            month: (i + 1) * 12,
            amount: annualRefund,
          }));
          const schedule = generateAmortizationSchedule(
            { principal: loanAmount, annualRate: interestRate, tenureYears: tenure },
            prepayments
          );
          totalInterest = schedule.totalInterest;
          newTenure = schedule.months.length / 12;
          timeSaved = tenure - newTenure;
          cashFlowImpact = "Low";
          flexibility = "High";

          firstYearInterest = schedule.months.slice(0, 12).reduce((sum, m) => sum + m.interest, 0);
          firstYearPrincipal = schedule.months.slice(0, 12).reduce((sum, m) => sum + m.principal, 0);
          firstYearPrincipal += annualRefund;
          break;
        }

        case "lumpsum": {
          const { prepaymentAmount, year } = strategyInputs.lumpsum;
          const prepayments = [{ month: year * 12, amount: prepaymentAmount }];
          const schedule = generateAmortizationSchedule(
            { principal: loanAmount, annualRate: interestRate, tenureYears: tenure },
            prepayments
          );
          totalInterest = schedule.totalInterest;
          newTenure = schedule.months.length / 12;
          timeSaved = tenure - newTenure;
          cashFlowImpact = "High";
          flexibility = "Low";

          // First year (before prepayment)
          const baseSchedule = generateAmortizationSchedule({
            principal: loanAmount,
            annualRate: interestRate,
            tenureYears: tenure,
          });
          firstYearInterest = baseSchedule.months.slice(0, 12).reduce((sum, m) => sum + m.interest, 0);
          firstYearPrincipal = baseSchedule.months.slice(0, 12).reduce((sum, m) => sum + m.principal, 0);
          break;
        }

        case "stepup": {
          const { annualIncrease } = strategyInputs.stepup;
          const result = calculateStepUpEMI(loanAmount, interestRate, tenure, annualIncrease);
          totalInterest = result.totalInterest;
          newTenure = result.actualTenure;
          timeSaved = tenure - newTenure;
          cashFlowImpact = "Medium";
          flexibility = "Medium";

          // First year calculation
          const baseEmi = calculateEMI(loanAmount, interestRate, tenure);
          const monthlyRate = interestRate / 12 / 100;
          let balance = loanAmount;
          firstYearInterest = 0;
          firstYearPrincipal = 0;

          for (let i = 0; i < 12; i++) {
            const interest = balance * monthlyRate;
            const principal = baseEmi - interest;
            balance -= principal;
            firstYearInterest += interest;
            firstYearPrincipal += principal;
          }
          break;
        }

        case "prepayment": {
          const { prepaymentAmount, reduceTenure } = strategyInputs.prepayment;
          const result = calculatePrepaymentImpact(
            loanAmount,
            interestRate,
            tenure,
            prepaymentAmount,
            reduceTenure
          );
          totalInterest = baseline.totalInterest - result.interestSaved;
          newTenure = result.newTenure;
          timeSaved = result.timeSaved;
          cashFlowImpact = "Medium";
          flexibility = "High";

          // First year
          const baseSchedule = generateAmortizationSchedule({
            principal: loanAmount,
            annualRate: interestRate,
            tenureYears: tenure,
          });
          firstYearInterest = baseSchedule.months.slice(0, 12).reduce((sum, m) => sum + m.interest, 0);
          firstYearPrincipal = baseSchedule.months.slice(0, 12).reduce((sum, m) => sum + m.principal, 0);
          firstYearPrincipal += prepaymentAmount;
          break;
        }

        case "balancetransfer": {
          const { newRate, processingFees } = strategyInputs.balancetransfer;
          totalInterest = calculateTotalInterest(loanAmount, newRate, tenure) + processingFees;
          newTenure = tenure;
          timeSaved = 0;
          cashFlowImpact = "Low";
          flexibility = "Low";

          // First year with new rate
          const schedule = generateAmortizationSchedule({
            principal: loanAmount,
            annualRate: newRate,
            tenureYears: tenure,
          });
          firstYearInterest = schedule.months.slice(0, 12).reduce((sum, m) => sum + m.interest, 0);
          firstYearPrincipal = schedule.months.slice(0, 12).reduce((sum, m) => sum + m.principal, 0);
          break;
        }
      }

      const interestSaved = baseline.totalInterest - totalInterest;
      const taxBenefits = calculateHomeLoanTaxBenefits(
        firstYearPrincipal,
        firstYearInterest,
        estimatedIncome,
        "self-occupied",
        taxRegime
      );
      const netBenefit = interestSaved + taxBenefits.totalBenefit;

      return {
        id: strategyId,
        name: strategy.name,
        difficulty: strategy.difficulty,
        totalInterest,
        interestSaved,
        taxBenefitsYear1: taxBenefits.totalBenefit,
        netBenefit,
        timeSaved,
        newTenure,
        cashFlowImpact,
        flexibility,
      };
    });
  }, [selectedStrategies, loanAmount, interestRate, tenure, taxSlab, taxRegime, strategyInputs, baseline]);

  // Find winners for each metric
  const winners = useMemo(() => {
    if (strategyResults.length === 0) return {};

    return {
      netBenefit: strategyResults.reduce((max, s) => (s.netBenefit > max.netBenefit ? s : max)),
      interestSaved: strategyResults.reduce((max, s) => (s.interestSaved > max.interestSaved ? s : max)),
      taxBenefits: strategyResults.reduce((max, s) => (s.taxBenefitsYear1 > max.taxBenefitsYear1 ? s : max)),
      timeSaved: strategyResults.reduce((max, s) => (s.timeSaved > max.timeSaved ? s : max)),
      easiest: strategyResults.reduce((max, s) => (s.difficulty === "Easy" ? s : max)),
      flexible: strategyResults.reduce((max, s) => (s.flexibility === "High" ? s : max)),
      lowCashFlow: strategyResults.reduce((max, s) => (s.cashFlowImpact === "Low" ? s : max)),
    };
  }, [strategyResults]);

  // Chart data
  const netBenefitChartData = useMemo(() => {
    return strategyResults.map((result, index) => ({
      name: result.name.split(" ").slice(0, 2).join(" "),
      benefit: Math.round(result.netBenefit / 100000), // In lakhs
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [strategyResults]);

  const interestSavedPieData = useMemo(() => {
    return strategyResults.map((result, index) => ({
      name: result.name.split(" ").slice(0, 2).join(" "),
      value: Math.round(result.interestSaved / 100000), // In lakhs
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [strategyResults]);

  const tenureComparisonData = useMemo(() => {
    const data = [
      {
        strategy: "Baseline",
        tenure: baseline.tenure,
        fill: "#9ca3af",
      },
    ];

    strategyResults.forEach((result, index) => {
      data.push({
        strategy: result.name.split(" ").slice(0, 2).join(" "),
        tenure: result.newTenure,
        fill: CHART_COLORS[index % CHART_COLORS.length],
      });
    });

    return data;
  }, [strategyResults, baseline]);

  // Recommendations
  const recommendations = useMemo(() => {
    if (strategyResults.length === 0) return null;

    const bestSavings = winners.netBenefit;
    const easiest = winners.easiest;
    const mostFlexible = winners.flexible;

    // Recommend combination
    const easyStrategies = strategyResults.filter((s) => s.difficulty === "Easy");
    const mediumStrategies = strategyResults.filter((s) => s.difficulty === "Medium");

    let combinationText = "";
    if (easyStrategies.length > 0 && mediumStrategies.length > 0) {
      combinationText = `${easyStrategies[0].name} + ${mediumStrategies[0].name}`;
    } else if (strategyResults.length >= 2) {
      combinationText = `${strategyResults[0].name} + ${strategyResults[1].name}`;
    }

    return {
      bestSavings,
      easiest,
      mostFlexible,
      combination: combinationText,
    };
  }, [strategyResults, winners]);

  // Action plan
  const actionPlan = useMemo(() => {
    if (strategyResults.length === 0) return null;

    const sortedByDifficulty = [...strategyResults].sort((a, b) => {
      const difficultyOrder = { Easy: 0, Medium: 1, Hard: 2 };
      return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] -
             difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
    });

    return {
      step1: sortedByDifficulty[0],
      step2: sortedByDifficulty[1] || sortedByDifficulty[0],
      step3: strategyResults.reduce((max, s) => (s.netBenefit > max.netBenefit ? s : max)),
      totalSavings: strategyResults.reduce((sum, s) => sum + s.netBenefit, 0) / strategyResults.length,
    };
  }, [strategyResults]);

  const canCompare = selectedStrategies.length >= 2 && selectedStrategies.length <= 4;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/strategies/all">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Strategies
                </Button>
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Strategy Comparison Tool
              </h1>
            </div>
            <Badge variant="outline" className="text-sm">
              {selectedStrategies.length} / 4 selected
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="select">
              <Target className="h-4 w-4 mr-2" />
              Select Strategies
            </TabsTrigger>
            <TabsTrigger value="compare" disabled={!canCompare}>
              <TrendingDown className="h-4 w-4 mr-2" />
              Compare Results
            </TabsTrigger>
            <TabsTrigger value="action" disabled={!canCompare}>
              <Zap className="h-4 w-4 mr-2" />
              Action Plan
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Select Strategies */}
          <TabsContent value="select" className="space-y-8">
            {/* Common Inputs */}
            <Card>
              <CardHeader>
                <CardTitle>Loan Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Loan Amount: {formatIndianCurrency(loanAmount)}</Label>
                    <Slider
                      value={[loanAmount]}
                      onValueChange={(v) => setLoanAmount(v[0])}
                      min={100000}
                      max={10000000}
                      step={100000}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹1L</span>
                      <span>₹1Cr</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Interest Rate: {interestRate}%</Label>
                    <Slider
                      value={[interestRate]}
                      onValueChange={(v) => setInterestRate(v[0])}
                      min={7}
                      max={12}
                      step={0.1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>7%</span>
                      <span>12%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tenure: {tenure} years</Label>
                    <Slider
                      value={[tenure]}
                      onValueChange={(v) => setTenure(v[0])}
                      min={5}
                      max={30}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>5 years</span>
                      <span>30 years</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tax Slab</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {[5, 10, 20, 30].map((slab) => (
                        <Button
                          key={slab}
                          variant={taxSlab === slab ? "default" : "outline"}
                          onClick={() => setTaxSlab(slab)}
                          className="w-full"
                        >
                          {slab}%
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tax Regime</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={taxRegime === "old" ? "default" : "outline"}
                      onClick={() => setTaxRegime("old")}
                    >
                      Old Regime
                    </Button>
                    <Button
                      variant={taxRegime === "new" ? "default" : "outline"}
                      onClick={() => setTaxRegime("new")}
                    >
                      New Regime
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strategy Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Strategies to Compare (2-4)</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedStrategies.length === 4 && (
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Maximum 4 strategies can be compared. Deselect one to add another.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ALL_STRATEGIES.map((strategy) => {
                    const isSelected = selectedStrategies.includes(strategy.id);
                    return (
                      <Card
                        key={strategy.id}
                        className={`cursor-pointer transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "hover:border-gray-400"
                        }`}
                        onClick={() => toggleStrategy(strategy.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold">{strategy.name}</h3>
                            {isSelected && (
                              <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                            )}
                          </div>
                          <Badge
                            variant={
                              strategy.difficulty === "Easy"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {strategy.difficulty}
                          </Badge>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Strategy-Specific Inputs */}
            {selectedStrategies.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Strategy-Specific Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedStrategies.includes("taxrefund") && (
                    <div className="space-y-2">
                      <Label>Tax Refund Amplification: Annual Refund Amount</Label>
                      <Input
                        type="number"
                        value={strategyInputs.taxrefund.annualRefund}
                        onChange={(e) =>
                          setStrategyInputs({
                            ...strategyInputs,
                            taxrefund: { annualRefund: Number(e.target.value) },
                          })
                        }
                        min={50000}
                        max={150000}
                        step={10000}
                      />
                      <p className="text-sm text-gray-600">₹50,000 - ₹1,50,000</p>
                    </div>
                  )}

                  {selectedStrategies.includes("lumpsum") && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Lump Sum: Prepayment Amount</Label>
                        <Input
                          type="number"
                          value={strategyInputs.lumpsum.prepaymentAmount}
                          onChange={(e) =>
                            setStrategyInputs({
                              ...strategyInputs,
                              lumpsum: {
                                ...strategyInputs.lumpsum,
                                prepaymentAmount: Number(e.target.value),
                              },
                            })
                          }
                          step={50000}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Year of Prepayment</Label>
                        <Input
                          type="number"
                          value={strategyInputs.lumpsum.year}
                          onChange={(e) =>
                            setStrategyInputs({
                              ...strategyInputs,
                              lumpsum: {
                                ...strategyInputs.lumpsum,
                                year: Number(e.target.value),
                              },
                            })
                          }
                          min={1}
                          max={tenure}
                        />
                      </div>
                    </div>
                  )}

                  {selectedStrategies.includes("stepup") && (
                    <div className="space-y-2">
                      <Label>Step-Up EMI: Annual Increase %</Label>
                      <Slider
                        value={[strategyInputs.stepup.annualIncrease]}
                        onValueChange={(v) =>
                          setStrategyInputs({
                            ...strategyInputs,
                            stepup: { annualIncrease: v[0] },
                          })
                        }
                        min={3}
                        max={15}
                        step={1}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>3%</span>
                        <span className="font-semibold">{strategyInputs.stepup.annualIncrease}%</span>
                        <span>15%</span>
                      </div>
                    </div>
                  )}

                  {selectedStrategies.includes("prepayment") && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Part-Prepayment: Amount</Label>
                        <Input
                          type="number"
                          value={strategyInputs.prepayment.prepaymentAmount}
                          onChange={(e) =>
                            setStrategyInputs({
                              ...strategyInputs,
                              prepayment: {
                                ...strategyInputs.prepayment,
                                prepaymentAmount: Number(e.target.value),
                              },
                            })
                          }
                          step={50000}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Prepayment Strategy</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant={
                              strategyInputs.prepayment.reduceTenure
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              setStrategyInputs({
                                ...strategyInputs,
                                prepayment: {
                                  ...strategyInputs.prepayment,
                                  reduceTenure: true,
                                },
                              })
                            }
                          >
                            Reduce Tenure
                          </Button>
                          <Button
                            variant={
                              !strategyInputs.prepayment.reduceTenure
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              setStrategyInputs({
                                ...strategyInputs,
                                prepayment: {
                                  ...strategyInputs.prepayment,
                                  reduceTenure: false,
                                },
                              })
                            }
                          >
                            Reduce EMI
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedStrategies.includes("balancetransfer") && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Balance Transfer: New Interest Rate %</Label>
                        <Input
                          type="number"
                          value={strategyInputs.balancetransfer.newRate}
                          onChange={(e) =>
                            setStrategyInputs({
                              ...strategyInputs,
                              balancetransfer: {
                                ...strategyInputs.balancetransfer,
                                newRate: Number(e.target.value),
                              },
                            })
                          }
                          step={0.1}
                          min={6}
                          max={interestRate}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Processing Fees</Label>
                        <Input
                          type="number"
                          value={strategyInputs.balancetransfer.processingFees}
                          onChange={(e) =>
                            setStrategyInputs({
                              ...strategyInputs,
                              balancetransfer: {
                                ...strategyInputs.balancetransfer,
                                processingFees: Number(e.target.value),
                              },
                            })
                          }
                          step={1000}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {!canCompare && selectedStrategies.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {selectedStrategies.length < 2
                    ? "Select at least 2 strategies to compare"
                    : "Select at most 4 strategies to compare"}
                </AlertDescription>
              </Alert>
            )}

            {canCompare && (
              <div className="flex justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                  onClick={() => setActiveTab("compare")}
                >
                  Compare Strategies
                  <TrendingDown className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Tab 2: Compare Results */}
          <TabsContent value="compare" className="space-y-8">
            {/* Comparison Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Strategy Comparison</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead>Baseline</TableHead>
                        {strategyResults.map((result) => (
                          <TableHead key={result.id}>{result.name}</TableHead>
                        ))}
                        <TableHead className="text-center">Winner</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-semibold">Total Interest</TableCell>
                        <TableCell>{formatIndianCurrency(baseline.totalInterest)}</TableCell>
                        {strategyResults.map((result) => (
                          <TableCell key={result.id}>
                            {formatIndianCurrency(result.totalInterest)}
                          </TableCell>
                        ))}
                        <TableCell className="text-center">-</TableCell>
                      </TableRow>

                      <TableRow className="bg-green-50">
                        <TableCell className="font-semibold">Interest Saved</TableCell>
                        <TableCell>-</TableCell>
                        {strategyResults.map((result) => (
                          <TableCell key={result.id} className="font-semibold text-green-700">
                            {formatIndianCurrency(result.interestSaved)}
                          </TableCell>
                        ))}
                        <TableCell className="text-center">
                          {winners.interestSaved && (
                            <Trophy className="h-5 w-5 text-yellow-500 inline" />
                          )}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="font-semibold">Tax Benefits (Year 1)</TableCell>
                        <TableCell>{formatIndianCurrency(baseline.taxBenefitsYear1)}</TableCell>
                        {strategyResults.map((result) => (
                          <TableCell key={result.id}>
                            {formatIndianCurrency(result.taxBenefitsYear1)}
                          </TableCell>
                        ))}
                        <TableCell className="text-center">
                          {winners.taxBenefits && (
                            <Trophy className="h-5 w-5 text-yellow-500 inline" />
                          )}
                        </TableCell>
                      </TableRow>

                      <TableRow className="bg-blue-50">
                        <TableCell className="font-semibold">Net Benefit</TableCell>
                        <TableCell>-</TableCell>
                        {strategyResults.map((result) => (
                          <TableCell key={result.id} className="font-semibold text-blue-700">
                            {formatIndianCurrency(result.netBenefit)}
                          </TableCell>
                        ))}
                        <TableCell className="text-center">
                          {winners.netBenefit && (
                            <Trophy className="h-5 w-5 text-yellow-500 inline" />
                          )}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="font-semibold">Time Saved</TableCell>
                        <TableCell>-</TableCell>
                        {strategyResults.map((result) => (
                          <TableCell key={result.id}>
                            {result.timeSaved.toFixed(1)} years
                          </TableCell>
                        ))}
                        <TableCell className="text-center">
                          {winners.timeSaved && (
                            <Trophy className="h-5 w-5 text-yellow-500 inline" />
                          )}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="font-semibold">New Tenure</TableCell>
                        <TableCell>{baseline.tenure} years</TableCell>
                        {strategyResults.map((result) => (
                          <TableCell key={result.id}>
                            {result.newTenure.toFixed(1)} years
                          </TableCell>
                        ))}
                        <TableCell className="text-center">-</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="font-semibold">Difficulty</TableCell>
                        <TableCell>-</TableCell>
                        {strategyResults.map((result) => (
                          <TableCell key={result.id}>
                            <Badge
                              variant={
                                result.difficulty === "Easy" ? "default" : "secondary"
                              }
                            >
                              {result.difficulty}
                            </Badge>
                          </TableCell>
                        ))}
                        <TableCell className="text-center">
                          {winners.easiest && (
                            <Trophy className="h-5 w-5 text-yellow-500 inline" />
                          )}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="font-semibold">Cash Flow Impact</TableCell>
                        <TableCell>-</TableCell>
                        {strategyResults.map((result) => (
                          <TableCell key={result.id}>{result.cashFlowImpact}</TableCell>
                        ))}
                        <TableCell className="text-center">
                          {winners.lowCashFlow && (
                            <Trophy className="h-5 w-5 text-yellow-500 inline" />
                          )}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="font-semibold">Flexibility</TableCell>
                        <TableCell>-</TableCell>
                        {strategyResults.map((result) => (
                          <TableCell key={result.id}>{result.flexibility}</TableCell>
                        ))}
                        <TableCell className="text-center">
                          {winners.flexible && (
                            <Trophy className="h-5 w-5 text-yellow-500 inline" />
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Visualizations */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Net Benefit Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Net Benefit Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={netBenefitChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis label={{ value: "Benefit (Lakhs)", angle: -90, position: "insideLeft" }} />
                      <Tooltip
                        formatter={(value: number) => `₹${value}L`}
                        labelFormatter={(label) => `Strategy: ${label}`}
                      />
                      <Bar dataKey="benefit" radius={[8, 8, 0, 0]}>
                        {netBenefitChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Interest Saved Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Interest Saved Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={interestSavedPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ₹${entry.value}L`}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {interestSavedPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `₹${value}L`} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Tenure Comparison */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Tenure Reduction Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={tenureComparisonData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" label={{ value: "Years", position: "insideBottom", offset: -5 }} />
                      <YAxis type="category" dataKey="strategy" width={150} />
                      <Tooltip formatter={(value: number) => `${value.toFixed(1)} years`} />
                      <Bar dataKey="tenure" radius={[0, 8, 8, 0]}>
                        {tenureComparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            {recommendations && (
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-6 w-6 text-blue-600" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold">Best for Maximum Savings</h3>
                      </div>
                      <p className="text-2xl font-bold text-green-700">
                        {recommendations.bestSavings.name}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Save {formatIndianCurrency(recommendations.bestSavings.netBenefit)}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold">Easiest to Implement</h3>
                      </div>
                      <p className="text-2xl font-bold text-blue-700">
                        {recommendations.easiest.name}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {recommendations.easiest.difficulty} difficulty
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-5 w-5 text-purple-600" />
                        <h3 className="font-semibold">Best for Flexibility</h3>
                      </div>
                      <p className="text-2xl font-bold text-purple-700">
                        {recommendations.mostFlexible.name}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {recommendations.mostFlexible.flexibility} flexibility
                      </p>
                    </div>
                  </div>

                  {recommendations.combination && (
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        <h3 className="font-semibold">Recommended Combination</h3>
                      </div>
                      <p className="text-lg font-bold text-gray-800">
                        {recommendations.combination}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Combine strategies for maximum impact
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600"
                onClick={() => setActiveTab("action")}
              >
                See Your Action Plan
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </TabsContent>

          {/* Tab 3: Action Plan */}
          <TabsContent value="action" className="space-y-8">
            {actionPlan && (
              <>
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Zap className="h-7 w-7 text-green-600" />
                      Your Personalized Action Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {/* Step 1 */}
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          1
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">
                            Start with {actionPlan.step1.name}
                          </h3>
                          <p className="text-gray-700 mb-2">
                            This is the easiest strategy to implement. Begin immediately to start
                            seeing results.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="default">{actionPlan.step1.difficulty}</Badge>
                            <Badge variant="outline">
                              Save {formatIndianCurrency(actionPlan.step1.interestSaved)}
                            </Badge>
                            <Badge variant="outline">
                              {actionPlan.step1.cashFlowImpact} Cash Flow Impact
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Step 2 */}
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          2
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">
                            Add {actionPlan.step2.name} after 1 year
                          </h3>
                          <p className="text-gray-700 mb-2">
                            Once you're comfortable with the first strategy, layer this one on top
                            for compounded benefits.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="default">{actionPlan.step2.difficulty}</Badge>
                            <Badge variant="outline">
                              Save {formatIndianCurrency(actionPlan.step2.interestSaved)}
                            </Badge>
                            <Badge variant="outline">
                              {actionPlan.step2.flexibility} Flexibility
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Step 3 */}
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          3
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">
                            Maximize with {actionPlan.step3.name}
                          </h3>
                          <p className="text-gray-700 mb-2">
                            This strategy offers the highest savings. Implement when you have the
                            bandwidth and resources.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="default">{actionPlan.step3.difficulty}</Badge>
                            <Badge variant="outline">
                              Save {formatIndianCurrency(actionPlan.step3.netBenefit)}
                            </Badge>
                            <Badge variant="outline" className="bg-yellow-100">
                              <Trophy className="h-3 w-3 mr-1" />
                              Best Overall
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Expected Savings */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h3 className="font-bold text-xl mb-4 text-center">
                        Expected Total Savings
                      </h3>
                      <p className="text-5xl font-bold text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        {formatIndianCurrency(actionPlan.totalSavings)}
                      </p>
                      <p className="text-center text-gray-600 mt-2">
                        Average savings across all selected strategies over {tenure} years
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <Card>
                  <CardHeader>
                    <CardTitle>What to Do Next</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Review Your Bank's Terms</h4>
                          <p className="text-gray-600 text-sm">
                            Check if your current lender allows prepayments and bi-weekly payments
                            without penalties.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Calculate Tax Benefits</h4>
                          <p className="text-gray-600 text-sm">
                            Consult with a CA to maximize Section 80C and 24(b) deductions based on
                            your chosen strategies.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Set Up Automated Payments</h4>
                          <p className="text-gray-600 text-sm">
                            For strategies like bi-weekly payments, set up standing instructions with
                            your bank.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Track Your Progress</h4>
                          <p className="text-gray-600 text-sm">
                            Review your loan statement quarterly to ensure prepayments are being
                            applied correctly.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Consider Balance Transfer</h4>
                          <p className="text-gray-600 text-sm">
                            If you selected balance transfer, compare offers from multiple lenders
                            before making the switch.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* CTA */}
                <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <CardContent className="p-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Saving?</h2>
                    <p className="text-xl mb-6 opacity-90">
                      Download your personalized comparison report and take action today
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                      <Button size="lg" variant="secondary">
                        <Download className="mr-2 h-5 w-5" />
                        Download PDF Report
                      </Button>
                      <Link href="/strategies/all">
                        <Button size="lg" variant="outline" className="text-white border-white">
                          View All 12 Strategies
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
