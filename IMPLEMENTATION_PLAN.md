# Home Loan Toolkit - Complete Feature Implementation Plan

## ✅ COMPLETED (Committed: 2386381)

### Core Utility Libraries
- **lib/tax-utils.ts** - Complete Indian tax calculations
  - Section 80C (principal deduction, ₹1.5L limit)
  - Section 24B (interest deduction, ₹2L limit)
  - LTCG/STCG calculations
  - Old vs New regime comparison

- **lib/rate-utils.ts** - 6-factor personalization
  - Credit Score: 750+ (-0.25%) to <650 (+0.75%)
  - Age: 25-35 (-0.10%) to 56-62 (+0.20%)
  - Gender: Women (-0.05%)
  - Employment: Govt (-0.15%) to Self-employed (+0.25%)
  - Loan Amount: ≥75L (-0.10%) to <20L (+0.15%)
  - Location: Metro (0%) to Tier-3 (+0.15%)

- **lib/loan-utils.ts** - All loan calculations
  - EMI calculation
  - Amortization schedule generation
  - Prepayment impact
  - Bi-weekly strategy
  - Step-up EMI

---

## 🔴 TODO - NEW PAGES (No Duplication)

### 1. `/app/calculators/personalized-rate/page.tsx` - PRIORITY 1
**Interactive sliders for YOUR personalized rate**

Features:
- 6 interactive sliders/selects:
  - Credit Score dropdown (750+, 700-749, 650-699, <650)
  - Age slider (23-62)
  - Gender radio (Male/Female/Other)
  - Employment dropdown (4 types)
  - Loan Amount input
  - Location dropdown (3 tiers)

- Real-time calculation showing:
  - Base rate for each bank
  - YOUR adjusted rate
  - Breakdown of each adjustment
  - Best bank for YOUR profile

- Comparison table:
  | Bank | Base Rate | Your Rate | Adjustment | You Save |
  |------|-----------|-----------|------------|----------|
  | SBI  | 8.50%     | 8.35%     | -0.15%     | ₹2.5L    |

- Improvement tips section:
  - "Improve credit score to 750+ to save ₹X"
  - "Government job would save you Y%"

**Based on:** home_loan_toolkit.py lines 4402-4496

---

### 2. `/app/guides/cibil-impact/page.tsx` - PRIORITY 2
**CIBIL Impact Timeline - What happens when you're late?**

Features:
- Interactive slider: Days Late (1-180)
- Real-time impact display:

  ```
  Day 1-30:  2% penalty/month (₹45,000 × 2% = ₹900/month)
  Day 30:    30 DPD marked, score drops 750 → 680
  Day 60:    60 DPD, score → 620, legal notice sent
  Day 90:    NPA status, 90 DPD stays for 7 YEARS
  Day 180:   Property auction under SARFAESI Act
  ```

- Penalty calculator:
  - Input: EMI amount
  - Output: Exact penalty for days late
  - Effective EMI = Original + Penalty

- Color-coded risk levels:
  - Green (1-15 days): Call bank, explain
  - Yellow (16-30 days): Urgent, pay now
  - Orange (31-60 days): CIBIL hit, legal notice
  - Red (61-90 days): Serious consequences
  - Dark Red (90+ days): Property at risk

- Emotional messaging:
  - "Your hands might shake when you see the auction notice"
  - "90 DPD stays on report for 7 years - affects future loans"

**Based on:** home_loan_toolkit.py lines 4625-4705

---

### 3. `/app/calculators/compare-strategies/page.tsx` - PRIORITY 3
**Strategy Comparison Tool**

Features:
- Select 2-4 strategies to compare side-by-side
- Common inputs (loan, rate, tenure)
- Strategy-specific inputs (prepayment, SIP return, etc.)
- Comparison table showing:
  - Total interest (standard vs strategy)
  - Interest saved
  - Time saved
  - Implementation difficulty
  - Cash flow impact
  - Winner badge

**Based on:** All 12 strategy functions combined

---

## 🟡 TODO - ENHANCE EXISTING PAGES (No Duplication)

### 4. UPDATE `/app/banks/page.tsx`
**Add personalized rate section AT TOP**

Changes:
- Add interactive profile selector ABOVE existing reviews
- Show "Banks Ranked for YOUR Profile" table
- Existing reviews section stays BELOW
- No duplication of bank data (use same BANK_DATA)

New Section:
```
┌─────────────────────────────────────────────┐
│ 🎯 Find Your Best Rate                      │
│                                             │
│ [Credit Score ▼] [Age ───] [Gender ○]     │
│ [Employment ▼] [Loan Amount] [Location ▼]  │
│                                             │
│ YOUR BEST RATES:                            │
│ 1. PNB    - 8.20% (Save ₹3.2L over 20y)   │
│ 2. SBI    - 8.35% (Save ₹2.8L)             │
│ 3. HDFC   - 8.50% (Save ₹2.1L)             │
└─────────────────────────────────────────────┘

[Existing Reviews Section Below]
```

---

### 5. UPDATE All 12 Strategy Pages
**Add tax-adjusted savings**

Changes for each strategy:
- Import tax-utils
- Add tax slab input
- Add regime selector (Old/New)
- Calculate tax benefits (80C + 24B)
- Show:
  - Interest saved (without tax)
  - Tax benefits (80C + 24B)
  - **NET savings (interest - tax benefits)**

Example for `/app/strategies/page.tsx` (Bi-Weekly):
```typescript
// Add inputs
const [taxSlab, setTaxSlab] = useState(0.30);
const [regime, setRegime] = useState<TaxRegime>("old");

// Calculate tax benefits
const taxBenefits = calculateHomeLoanTaxBenefits(
  principalThisYear,
  interestThisYear,
  taxableIncome,
  "self-occupied",
  regime
);

// Display
<Card>
  <h3>Total Savings</h3>
  <p>Interest Saved: ₹{interestSaved}</p>
  <p>Tax Benefits: ₹{taxBenefits.totalBenefit}</p>
  <p className="text-2xl font-bold">
    Net Benefit: ₹{interestSaved + taxBenefits.totalBenefit}
  </p>
</Card>
```

---

## 🟢 TODO - REUSABLE COMPONENTS

### 6. `/components/AmortizationSchedule.tsx`
Reusable table component showing month-by-month breakdown

Props:
- schedule: AmortizationSchedule (from loan-utils)
- highlightMonth?: number
- showYearlySummary?: boolean

Features:
- Sortable columns
- Yearly grouping
- Principal vs Interest visualization
- Balance graph
- Export to CSV

---

### 7. `/components/TaxBreakdown.tsx`
Reusable tax benefits display

Props:
- section80c: number
- section24b: number
- regime: TaxRegime

Features:
- Color-coded benefits
- Regime comparison
- Clickable help icons
- Limit indicators

---

## 📊 TODO - NAVIGATION UPDATES

### 8. UPDATE `/app/page.tsx` - Homepage
Add links to new calculators:
- Personalized Rate Calculator
- CIBIL Impact Timeline
- Strategy Comparison

### 9. UPDATE Navigation Bar (app/page.tsx + all pages)
Add dropdown menu:
```
Calculators ▼
├─ Personalized Rate
├─ Compare Strategies
└─ Hidden Costs

Guides ▼
├─ Tips & Tricks
├─ CIBIL Impact
└─ Bank Reviews
```

---

## 🧪 TODO - TESTING & DEPLOYMENT

### 10. Comprehensive Testing
- All 6 rate factors work
- Tax calculations accurate for both regimes
- All 12 strategies show tax-adjusted savings
- CIBIL timeline shows correct penalties
- Strategy comparison works for all combinations
- Mobile responsive for all new pages
- No console errors
- Build succeeds

### 11. Deploy to Render
- Push to GitHub
- Monitor build logs
- Verify all pages accessible
- Test on production URL

---

## 📈 SUCCESS METRICS

After implementation:
- ✅ 3 new calculator pages
- ✅ 1 new guide page
- ✅ 12 strategy pages enhanced with tax
- ✅ 1 bank page enhanced with personalization
- ✅ 2 reusable components
- ✅ Complete tax system integrated
- ✅ 6-factor rate personalization working
- ✅ All features from old Streamlit app ported
- ✅ Zero duplication of code/pages
- ✅ Production deployment successful

---

## 🎯 CURRENT STATUS

**Phase 1 Complete:** ✅ All utility libraries created and committed

**Phase 2 In Progress:** Creating new pages (Personalized Rate, CIBIL Impact, Compare Strategies)

**Phase 3 Pending:** Enhance existing pages (Banks, 12 Strategies)

**Phase 4 Pending:** Components, Navigation, Testing, Deployment

---

**Next Action:** Create `/app/calculators/personalized-rate/page.tsx`
