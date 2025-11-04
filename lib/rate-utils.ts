// Personalized Loan Rate Calculation Utilities
// Based on Financial_Apps/home_loan_toolkit.py lines 640-722

export type CreditScoreBand = "750+" | "700-749" | "650-699" | "<650";
export type AgeBracket = "23-24" | "25-35" | "36-45" | "46-55" | "56-62";
export type Gender = "male" | "female" | "other";
export type EmploymentType = "salaried-govt" | "salaried-mnc" | "salaried-other" | "self-employed";
export type Location = "metro-tier1" | "tier2" | "tier3";

export interface UserProfile {
  creditScore: CreditScoreBand;
  age: number;
  gender: Gender;
  employment: EmploymentType;
  loanAmount: number;
  location: Location;
}

export interface RateAdjustment {
  factor: string;
  adjustment: number;
  description: string;
}

export interface PersonalizedRate {
  baseRate: number;
  adjustedRate: number;
  adjustments: RateAdjustment[];
  totalAdjustment: number;
}

/**
 * Calculate credit score adjustment
 * Based on home_loan_toolkit.py lines 645-660
 */
function getCreditScoreAdjustment(creditScore: CreditScoreBand): RateAdjustment {
  const adjustments: Record<CreditScoreBand, number> = {
    "750+": -0.25,
    "700-749": 0,
    "650-699": 0.35,
    "<650": 0.75,
  };

  const descriptions: Record<CreditScoreBand, string> = {
    "750+": "Excellent credit score - premium rate",
    "700-749": "Good credit score - standard rate",
    "650-699": "Fair credit score - slightly higher rate",
    "<650": "Poor credit score - significant premium",
  };

  return {
    factor: "Credit Score",
    adjustment: adjustments[creditScore],
    description: descriptions[creditScore],
  };
}

/**
 * Calculate age-based adjustment
 * Based on home_loan_toolkit.py lines 662-675
 */
function getAgeAdjustment(age: number): RateAdjustment {
  let adjustment = 0;
  let description = "";

  if (age >= 23 && age <= 24) {
    adjustment = 0.20;
    description = "Very young borrower - higher risk premium";
  } else if (age >= 25 && age <= 35) {
    adjustment = -0.10;
    description = "Prime age group - best rates";
  } else if (age >= 36 && age <= 45) {
    adjustment = 0;
    description = "Mature borrower - standard rate";
  } else if (age >= 46 && age <= 55) {
    adjustment = 0.10;
    description = "Mid-senior age - slight premium";
  } else if (age >= 56 && age <= 62) {
    adjustment = 0.20;
    description = "Near retirement - higher risk";
  } else {
    adjustment = 0.50;
    description = "Outside typical lending age - very high premium";
  }

  return {
    factor: "Age",
    adjustment,
    description,
  };
}

/**
 * Calculate gender-based adjustment
 * Women get concession in most banks
 */
function getGenderAdjustment(gender: Gender): RateAdjustment {
  if (gender === "female") {
    return {
      factor: "Gender",
      adjustment: -0.05,
      description: "Women borrower concession",
    };
  }

  return {
    factor: "Gender",
    adjustment: 0,
    description: "Standard rate",
  };
}

/**
 * Calculate employment type adjustment
 * Based on home_loan_toolkit.py lines 677-690
 */
function getEmploymentAdjustment(employment: EmploymentType): RateAdjustment {
  const adjustments: Record<EmploymentType, { rate: number; desc: string }> = {
    "salaried-govt": {
      rate: -0.15,
      desc: "Government employee - most stable",
    },
    "salaried-mnc": {
      rate: -0.10,
      desc: "MNC employee - very stable",
    },
    "salaried-other": {
      rate: 0,
      desc: "Private sector - standard rate",
    },
    "self-employed": {
      rate: 0.25,
      desc: "Self-employed - higher risk premium",
    },
  };

  const { rate, desc } = adjustments[employment];

  return {
    factor: "Employment",
    adjustment: rate,
    description: desc,
  };
}

/**
 * Calculate loan amount adjustment
 * Based on home_loan_toolkit.py lines 692-705
 */
function getLoanAmountAdjustment(loanAmount: number): RateAdjustment {
  let adjustment = 0;
  let description = "";

  if (loanAmount >= 7500000) {
    // ≥75 Lakhs
    adjustment = -0.10;
    description = "High-value loan - premium customer rate";
  } else if (loanAmount >= 5000000) {
    // 50-75 Lakhs
    adjustment = 0;
    description = "Standard loan amount";
  } else if (loanAmount >= 2000000) {
    // 20-50 Lakhs
    adjustment = 0.05;
    description: "Below average loan - slight premium";
  } else {
    // <20 Lakhs
    adjustment = 0.15;
    description = "Small loan - processing cost premium";
  }

  return {
    factor: "Loan Amount",
    adjustment,
    description,
  };
}

/**
 * Calculate location-based adjustment
 * Based on home_loan_toolkit.py lines 707-722
 */
function getLocationAdjustment(location: Location): RateAdjustment {
  const adjustments: Record<Location, { rate: number; desc: string }> = {
    "metro-tier1": {
      rate: 0,
      desc: "Metro city - best rates",
    },
    "tier2": {
      rate: 0.10,
      desc: "Tier-2 city - slight premium",
    },
    "tier3": {
      rate: 0.15,
      desc: "Tier-3 city - higher risk premium",
    },
  };

  const { rate, desc } = adjustments[location];

  return {
    factor: "Location",
    adjustment: rate,
    description: desc,
  };
}

/**
 * Calculate personalized rate based on user profile
 * Main function that combines all factors
 */
export function calculatePersonalizedRate(
  baseRate: number,
  profile: UserProfile
): PersonalizedRate {
  const adjustments: RateAdjustment[] = [
    getCreditScoreAdjustment(profile.creditScore),
    getAgeAdjustment(profile.age),
    getGenderAdjustment(profile.gender),
    getEmploymentAdjustment(profile.employment),
    getLoanAmountAdjustment(profile.loanAmount),
    getLocationAdjustment(profile.location),
  ];

  const totalAdjustment = adjustments.reduce(
    (sum, adj) => sum + adj.adjustment,
    0
  );

  const adjustedRate = baseRate + totalAdjustment;

  return {
    baseRate,
    adjustedRate,
    adjustments,
    totalAdjustment,
  };
}

/**
 * Get age bracket from age number
 */
export function getAgeBracket(age: number): AgeBracket {
  if (age >= 23 && age <= 24) return "23-24";
  if (age >= 25 && age <= 35) return "25-35";
  if (age >= 36 && age <= 45) return "36-45";
  if (age >= 46 && age <= 55) return "46-55";
  if (age >= 56 && age <= 62) return "56-62";
  return "25-35"; // Default
}

/**
 * Validate user profile inputs
 */
export function validateProfile(profile: Partial<UserProfile>): string[] {
  const errors: string[] = [];

  if (profile.age !== undefined && (profile.age < 23 || profile.age > 62)) {
    errors.push("Age must be between 23 and 62 years");
  }

  if (profile.loanAmount !== undefined && profile.loanAmount < 100000) {
    errors.push("Loan amount must be at least ₹1 Lakh");
  }

  return errors;
}

/**
 * Get recommendations to improve rate
 */
export function getRateImprovementTips(profile: UserProfile): string[] {
  const tips: string[] = [];
  const personalizedRate = calculatePersonalizedRate(8.5, profile);

  personalizedRate.adjustments.forEach((adj) => {
    if (adj.adjustment > 0) {
      switch (adj.factor) {
        case "Credit Score":
          tips.push(
            "💡 Improve your credit score to 750+ to get -0.25% rate benefit. Pay EMIs on time and reduce credit utilization."
          );
          break;
        case "Age":
          tips.push(
            "💡 Your age bracket has a premium. Consider applying when you're in the 25-35 age range if possible."
          );
          break;
        case "Employment":
          if (profile.employment === "self-employed") {
            tips.push(
              "💡 Self-employed borrowers get +0.25% premium. Show 3+ years of consistent ITR to negotiate better rates."
            );
          }
          break;
        case "Loan Amount":
          if (profile.loanAmount < 2000000) {
            tips.push(
              "💡 Smaller loans have processing premiums. Consider combining multiple purposes into one larger loan."
            );
          }
          break;
        case "Location":
          if (profile.location !== "metro-tier1") {
            tips.push(
              "💡 Tier-2/3 cities have higher rates due to lower liquidity. Metro properties get better rates."
            );
          }
          break;
      }
    }
  });

  return tips;
}
