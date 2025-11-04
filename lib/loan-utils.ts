// Loan Calculation Utilities
// Based on Financial_Apps/home_loan_toolkit.py lines 425-584

export interface LoanParameters {
  principal: number;
  annualRate: number;
  tenureYears: number;
}

export interface MonthlyPayment {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
  cumulativePrincipal: number;
  cumulativeInterest: number;
}

export interface PrepaymentSchedule {
  month: number;
  amount: number;
}

export interface AmortizationSchedule {
  months: MonthlyPayment[];
  totalEmi: number;
  totalPrincipal: number;
  totalInterest: number;
  emi: number;
}

/**
 * Calculate EMI (Equated Monthly Installment)
 * Formula: P * r * (1+r)^n / ((1+r)^n - 1)
 * where P = principal, r = monthly interest rate, n = number of months
 */
export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureYears: number
): number {
  const monthlyRate = annualRate / 12 / 100;
  const months = tenureYears * 12;

  if (monthlyRate === 0) {
    return principal / months;
  }

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  return Math.round(emi);
}

/**
 * Generate complete amortization schedule
 * Based on home_loan_toolkit.py lines 550-584
 */
export function generateAmortizationSchedule(
  params: LoanParameters,
  prepayments: PrepaymentSchedule[] = []
): AmortizationSchedule {
  const { principal, annualRate, tenureYears } = params;
  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const emi = calculateEMI(principal, annualRate, tenureYears);

  const months: MonthlyPayment[] = [];
  let balance = principal;
  let cumulativePrincipal = 0;
  let cumulativeInterest = 0;

  // Create prepayment map for quick lookup
  const prepaymentMap = new Map<number, number>();
  prepayments.forEach((p) => prepaymentMap.set(p.month, p.amount));

  for (let month = 1; month <= totalMonths && balance > 0; month++) {
    const interestPayment = balance * monthlyRate;
    let principalPayment = emi - interestPayment;

    // Handle last month partial payment
    if (principalPayment > balance) {
      principalPayment = balance;
    }

    balance -= principalPayment;
    cumulativePrincipal += principalPayment;
    cumulativeInterest += interestPayment;

    months.push({
      month,
      emi,
      principal: principalPayment,
      interest: interestPayment,
      balance,
      cumulativePrincipal,
      cumulativeInterest,
    });

    // Apply prepayment if exists for this month
    const prepaymentAmount = prepaymentMap.get(month);
    if (prepaymentAmount && balance > 0) {
      balance = Math.max(0, balance - prepaymentAmount);
      cumulativePrincipal += Math.min(prepaymentAmount, balance + prepaymentAmount);
    }
  }

  return {
    months,
    totalEmi: emi * months.length,
    totalPrincipal: cumulativePrincipal,
    totalInterest: cumulativeInterest,
    emi,
  };
}

/**
 * Calculate total interest for a loan
 */
export function calculateTotalInterest(
  principal: number,
  annualRate: number,
  tenureYears: number
): number {
  const emi = calculateEMI(principal, annualRate, tenureYears);
  const totalMonths = tenureYears * 12;
  const totalPayment = emi * totalMonths;
  return totalPayment - principal;
}

/**
 * Calculate impact of a one-time prepayment
 * Returns new tenure OR new EMI based on choice
 */
export function calculatePrepaymentImpact(
  principal: number,
  annualRate: number,
  remainingTenure: number,
  prepaymentAmount: number,
  keepEmiSame: boolean = false
): {
  newEmi: number;
  newTenure: number;
  interestSaved: number;
  timeSaved: number;
} {
  const originalEmi = calculateEMI(principal, annualRate, remainingTenure);
  const originalInterest = calculateTotalInterest(
    principal,
    annualRate,
    remainingTenure
  );

  const newPrincipal = principal - prepaymentAmount;

  if (keepEmiSame) {
    // Reduce tenure, keep EMI same
    const newTenure = calculateTenureForEMI(
      newPrincipal,
      annualRate,
      originalEmi
    );
    const newInterest = calculateTotalInterest(
      newPrincipal,
      annualRate,
      newTenure
    );

    return {
      newEmi: originalEmi,
      newTenure,
      interestSaved: originalInterest - newInterest,
      timeSaved: remainingTenure - newTenure,
    };
  } else {
    // Reduce EMI, keep tenure same
    const newEmi = calculateEMI(newPrincipal, annualRate, remainingTenure);
    const newInterest = calculateTotalInterest(
      newPrincipal,
      annualRate,
      remainingTenure
    );

    return {
      newEmi,
      newTenure: remainingTenure,
      interestSaved: originalInterest - newInterest,
      timeSaved: 0,
    };
  }
}

/**
 * Calculate tenure required for a given EMI
 * Used in prepayment calculations
 */
function calculateTenureForEMI(
  principal: number,
  annualRate: number,
  targetEmi: number
): number {
  const monthlyRate = annualRate / 12 / 100;

  if (monthlyRate === 0) {
    return principal / targetEmi / 12;
  }

  // Formula: n = log(EMI / (EMI - P*r)) / log(1 + r)
  const months = Math.log(targetEmi / (targetEmi - principal * monthlyRate)) /
                 Math.log(1 + monthlyRate);

  return Math.max(0.1, months / 12); // Convert to years, minimum 0.1 year
}

/**
 * Calculate bi-weekly payment strategy impact
 * Pay half EMI every 2 weeks = 26 payments/year = 13 monthly payments
 */
export function calculateBiWeeklyImpact(
  principal: number,
  annualRate: number,
  tenureYears: number
): {
  monthlyEmi: number;
  biWeeklyPayment: number;
  newTenure: number;
  interestSaved: number;
  timeSaved: number;
} {
  const monthlyEmi = calculateEMI(principal, annualRate, tenureYears);
  const biWeeklyPayment = monthlyEmi / 2;

  // Annual prepayment = 1 extra monthly payment
  const annualPrepayment = monthlyEmi;

  // Simulate with annual prepayments
  const schedule = generateAmortizationSchedule(
    { principal, annualRate, tenureYears },
    Array.from({ length: tenureYears }, (_, i) => ({
      month: (i + 1) * 12,
      amount: annualPrepayment,
    }))
  );

  const newTenure = schedule.months.length / 12;
  const originalInterest = calculateTotalInterest(
    principal,
    annualRate,
    tenureYears
  );

  return {
    monthlyEmi,
    biWeeklyPayment,
    newTenure,
    interestSaved: originalInterest - schedule.totalInterest,
    timeSaved: tenureYears - newTenure,
  };
}

/**
 * Calculate step-up EMI strategy
 * Increase EMI by a fixed percentage annually
 */
export function calculateStepUpEMI(
  principal: number,
  annualRate: number,
  tenureYears: number,
  annualIncrease: number
): {
  schedule: { year: number; emi: number; yearlyPayment: number }[];
  totalInterest: number;
  actualTenure: number;
  interestSaved: number;
} {
  const baseEmi = calculateEMI(principal, annualRate, tenureYears);
  const monthlyRate = annualRate / 12 / 100;

  let balance = principal;
  let currentEmi = baseEmi;
  const schedule: { year: number; emi: number; yearlyPayment: number }[] = [];
  let totalInterest = 0;
  let year = 1;

  while (balance > 0 && year <= tenureYears * 2) {
    let yearlyPayment = 0;

    for (let month = 1; month <= 12 && balance > 0; month++) {
      const interest = balance * monthlyRate;
      const principal = Math.min(currentEmi - interest, balance);

      balance -= principal;
      totalInterest += interest;
      yearlyPayment += currentEmi;
    }

    schedule.push({ year, emi: currentEmi, yearlyPayment });

    // Increase EMI for next year
    currentEmi *= 1 + annualIncrease / 100;
    year++;
  }

  const originalInterest = calculateTotalInterest(
    principal,
    annualRate,
    tenureYears
  );

  return {
    schedule,
    totalInterest,
    actualTenure: schedule.length,
    interestSaved: originalInterest - totalInterest,
  };
}

/**
 * Format currency in Indian format
 */
export function formatIndianCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate monthly breakdown (principal vs interest) for display
 */
export function getMonthlyBreakdown(
  principal: number,
  annualRate: number,
  tenureYears: number,
  month: number
): {
  principalPortion: number;
  interestPortion: number;
  remainingBalance: number;
} {
  const schedule = generateAmortizationSchedule({
    principal,
    annualRate,
    tenureYears,
  });

  if (month < 1 || month > schedule.months.length) {
    return {
      principalPortion: 0,
      interestPortion: 0,
      remainingBalance: 0,
    };
  }

  const monthData = schedule.months[month - 1];

  return {
    principalPortion: monthData.principal,
    interestPortion: monthData.interest,
    remainingBalance: monthData.balance,
  };
}
