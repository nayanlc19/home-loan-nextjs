// Tax Calculation Utilities for Indian Home Loans
// Based on Financial_Apps/home_loan_toolkit.py lines 488-539

export const TAX_CONSTANTS = {
  SECTION_80C_LIMIT: 150000, // ₹1.5 Lakhs per year (principal repayment)
  SECTION_24B_SELF_OCCUPIED: 200000, // ₹2 Lakhs per year (interest deduction)
  SECTION_24B_LET_OUT: Infinity, // Unlimited for let-out property
  LTCG_EXEMPTION_EQUITY: 125000, // ₹1.25 Lakhs for equity
  LTCG_RATE_EQUITY: 0.10, // 10% after exemption
  LTCG_RATE_DEBT: 0.20, // 20% with indexation
  STCG_RATE_EQUITY: 0.15, // 15% flat
};

export type TaxRegime = "old" | "new";
export type PropertyType = "self-occupied" | "let-out";
export type InvestmentType = "equity" | "debt";

export interface TaxSlabBracket {
  min: number;
  max: number;
  rate: number;
}

// Indian Tax Slabs (Old Regime - FY 2024-25)
export const OLD_REGIME_SLABS: TaxSlabBracket[] = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 0.05 },
  { min: 500000, max: 1000000, rate: 0.20 },
  { min: 1000000, max: Infinity, rate: 0.30 },
];

// Indian Tax Slabs (New Regime - FY 2024-25)
export const NEW_REGIME_SLABS: TaxSlabBracket[] = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 700000, rate: 0.05 },
  { min: 700000, max: 1000000, rate: 0.10 },
  { min: 1000000, max: 1200000, rate: 0.15 },
  { min: 1200000, max: 1500000, rate: 0.20 },
  { min: 1500000, max: Infinity, rate: 0.30 },
];

/**
 * Calculate Section 80C benefit (Principal Repayment Deduction)
 * Only available in OLD tax regime
 */
export function calculate80cBenefit(
  principalPaid: number,
  taxableIncome: number,
  regime: TaxRegime = "old"
): number {
  if (regime === "new") return 0; // Not available in new regime

  const deduction = Math.min(principalPaid, TAX_CONSTANTS.SECTION_80C_LIMIT);
  const taxSaved = calculateTaxOnIncome(taxableIncome, regime) -
                   calculateTaxOnIncome(taxableIncome - deduction, regime);

  return taxSaved;
}

/**
 * Calculate Section 24(b) benefit (Interest Deduction)
 * Available in BOTH old and new regimes
 */
export function calculate24bBenefit(
  interestPaid: number,
  taxableIncome: number,
  propertyType: PropertyType = "self-occupied",
  regime: TaxRegime = "old"
): number {
  const limit = propertyType === "self-occupied"
    ? TAX_CONSTANTS.SECTION_24B_SELF_OCCUPIED
    : TAX_CONSTANTS.SECTION_24B_LET_OUT;

  const deduction = Math.min(interestPaid, limit);
  const taxSaved = calculateTaxOnIncome(taxableIncome, regime) -
                   calculateTaxOnIncome(taxableIncome - deduction, regime);

  return taxSaved;
}

/**
 * Calculate total home loan tax benefits for a year
 */
export function calculateHomeLoanTaxBenefits(
  principalPaid: number,
  interestPaid: number,
  taxableIncome: number,
  propertyType: PropertyType = "self-occupied",
  regime: TaxRegime = "old"
): {
  section80c: number;
  section24b: number;
  totalBenefit: number;
} {
  const section80c = calculate80cBenefit(principalPaid, taxableIncome, regime);
  const section24b = calculate24bBenefit(interestPaid, taxableIncome, propertyType, regime);

  return {
    section80c,
    section24b,
    totalBenefit: section80c + section24b,
  };
}

/**
 * Calculate Long-Term Capital Gains (LTCG) Tax
 */
export function calculateLTCGTax(
  gains: number,
  investmentType: InvestmentType = "equity"
): number {
  if (investmentType === "equity") {
    const taxableGains = Math.max(0, gains - TAX_CONSTANTS.LTCG_EXEMPTION_EQUITY);
    return taxableGains * TAX_CONSTANTS.LTCG_RATE_EQUITY;
  } else {
    // Debt: 20% with indexation (simplified - assuming indexation benefit)
    return gains * TAX_CONSTANTS.LTCG_RATE_DEBT * 0.7; // 30% indexation benefit approx
  }
}

/**
 * Calculate Short-Term Capital Gains (STCG) Tax
 */
export function calculateSTCGTax(
  gains: number,
  investmentType: InvestmentType = "equity",
  taxableIncome: number = 0,
  regime: TaxRegime = "old"
): number {
  if (investmentType === "equity") {
    return gains * TAX_CONSTANTS.STCG_RATE_EQUITY;
  } else {
    // Debt STCG: Taxed at slab rate
    return calculateTaxOnIncome(taxableIncome + gains, regime) -
           calculateTaxOnIncome(taxableIncome, regime);
  }
}

/**
 * Calculate tax on income based on regime
 */
export function calculateTaxOnIncome(
  income: number,
  regime: TaxRegime = "old"
): number {
  const slabs = regime === "old" ? OLD_REGIME_SLABS : NEW_REGIME_SLABS;
  let tax = 0;

  for (const slab of slabs) {
    if (income > slab.min) {
      const taxableInThisSlab = Math.min(income, slab.max) - slab.min;
      tax += taxableInThisSlab * slab.rate;
    }
  }

  // Add 4% cess
  return tax * 1.04;
}

/**
 * Determine tax slab from income
 */
export function getTaxSlab(income: number, regime: TaxRegime = "old"): number {
  const slabs = regime === "old" ? OLD_REGIME_SLABS : NEW_REGIME_SLABS;

  for (const slab of slabs) {
    if (income >= slab.min && income < slab.max) {
      return slab.rate;
    }
  }

  return slabs[slabs.length - 1].rate;
}

/**
 * Compare tax regimes for home loan benefits
 */
export function compareRegimes(
  principalPaid: number,
  interestPaid: number,
  taxableIncome: number,
  propertyType: PropertyType = "self-occupied"
): {
  oldRegime: number;
  newRegime: number;
  betterRegime: TaxRegime;
  difference: number;
} {
  const oldBenefits = calculateHomeLoanTaxBenefits(
    principalPaid, interestPaid, taxableIncome, propertyType, "old"
  );

  const newBenefits = calculateHomeLoanTaxBenefits(
    principalPaid, interestPaid, taxableIncome, propertyType, "new"
  );

  const betterRegime = oldBenefits.totalBenefit > newBenefits.totalBenefit ? "old" : "new";
  const difference = Math.abs(oldBenefits.totalBenefit - newBenefits.totalBenefit);

  return {
    oldRegime: oldBenefits.totalBenefit,
    newRegime: newBenefits.totalBenefit,
    betterRegime,
    difference,
  };
}
