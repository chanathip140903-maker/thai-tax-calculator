export const formatTHB = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return '0.00';
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export type Income = {
  type40_1: number; // เงินเดือน โบนัส
  type40_2: number; // รับจ้างทั่วไป ค่านายหน้า
  type40_3: number; // ค่าลิขสิทธิ์
  type40_4a: number; // ดอกเบี้ย
  type40_4b: number; // เงินปันผล
  type40_5: number; // ค่าเช่า
  type40_6: number; // วิชาชีพอิสระ (default to 30% exp, if medical we'd need a toggle, assuming 30% for simplicity or add toggle)
  isMedicalProfession: boolean; // toggle for 40(6)
  type40_7: number; // รับเหมาก่อสร้าง
  type40_8: number; // อื่นๆ (default 60%)
};

export type Allowances = {
  spouse: boolean; // คู่สมรส
  children_1: number; // บุตรคนที่ 1 (คนละ 30,000)
  children_2_plus: number; // บุตรคนที่ 2 ขึ้นไป (คนละ 60,000)
  parents: number; // บิดามารดา (คนละ 30,000 max 2)
  disabled: number; // ผู้พิการ (คนละ 60,000)
  
  lifeInsurance: number; // ประกันชีวิต (max 100,000)
  healthInsurance: number; // ประกันสุขภาพ (max 25,000, รวมชีวิตไม่เกิน 100k)
  parentsHealthInsurance: number; // ประกันสุขภาพบิดามารดา (max 15,000)
  
  pensionInsurance: number; // ประกันบำนาญ (max 15% income, max 200,000)
  providentFund: number; // กองทุนสำรองเลี้ยงชีพ (max 15% income, max 500,000)
  ssf: number; // SSF (max 30% income, max 200,000)
  rmf: number; // RMF (max 30% income, max 500,000)
  // retirement fund group (pension + provident + ssf + rmf) max 500,000
  
  homeLoanInterest: number; // ดอกเบี้ยบ้าน (max 100,000)
  socialSecurity: number; // ประกันสังคม (max ~9,000)
  
  educationDonation: number; // บริจาคการศึกษา 2 เท่า (max 10% of net)
  generalDonation: number; // บริจาคทั่วไป (max 10% of net)
};

export type TaxBracket = {
  min: number;
  max: number | null;
  rate: number;
  taxableAmount: number;
  taxInBracket: number;
};

export type CalculationResult = {
  totalIncome: number;
  totalExpenses: number;
  incomeAfterExpenses: number;
  totalAllowances: number;
  netIncomeBeforeDonations: number;
  educationDonationDeductible: number;
  generalDonationDeductible: number;
  netTaxableIncome: number;
  taxLiability: number;
  brackets: TaxBracket[];
  hasFilingObligation: boolean;
  filingObligationReason: string;
};

const TAX_RATES = [
  { min: 0, max: 150000, rate: 0 },
  { min: 150000, max: 300000, rate: 0.05 },
  { min: 300000, max: 500000, rate: 0.10 },
  { min: 500000, max: 750000, rate: 0.15 },
  { min: 750000, max: 1000000, rate: 0.20 },
  { min: 1000000, max: 2000000, rate: 0.25 },
  { min: 2000000, max: 5000000, rate: 0.30 },
  { min: 5000000, max: null, rate: 0.35 },
];

export function calculateTax(
  income: Partial<Income>,
  allowances: Partial<Allowances>,
  isMidYear: boolean = false
): CalculationResult {
  const inc = {
    type40_1: income.type40_1 || 0,
    type40_2: income.type40_2 || 0,
    type40_3: income.type40_3 || 0,
    type40_4a: income.type40_4a || 0,
    type40_4b: income.type40_4b || 0,
    type40_5: income.type40_5 || 0,
    type40_6: income.type40_6 || 0,
    isMedicalProfession: income.isMedicalProfession || false,
    type40_7: income.type40_7 || 0,
    type40_8: income.type40_8 || 0,
  };

  const totalIncome = Object.keys(inc)
    .filter(k => k !== 'isMedicalProfession')
    .reduce((sum, k) => sum + (inc[k as keyof typeof inc] as number), 0);

  // 1. Calculate Expenses
  let totalExpenses = 0;

  // 40(1) + 40(2) -> 50% max 100,000
  const exp12 = Math.min((inc.type40_1 + inc.type40_2) * 0.5, 100000);
  totalExpenses += exp12;

  // 40(3) -> 50% max 100,000
  const exp3 = Math.min(inc.type40_3 * 0.5, 100000);
  // NOTE: In reality, 40(1)+(2)+(3) combined expense might have a cap, but legally 40(1)+(2) is combined 100k, and 40(3) has its own 100k cap.
  totalExpenses += exp3;

  // 40(4) -> 0
  
  // 40(5) -> 30% (assuming building/house standard)
  totalExpenses += inc.type40_5 * 0.3;

  // 40(6) -> Medical 60%, Others 30%
  totalExpenses += inc.type40_6 * (inc.isMedicalProfession ? 0.6 : 0.3);

  // 40(7) -> 70%
  totalExpenses += inc.type40_7 * 0.7;

  // 40(8) -> 60%
  totalExpenses += inc.type40_8 * 0.6;

  const incomeAfterExpenses = totalIncome - totalExpenses;

  // 2. Calculate Allowances
  let totalAllowances = 0;
  
  // Halve personal fixed allowances for mid-year (94)
  const allowanceMultiplier = isMidYear ? 0.5 : 1;

  // Personal
  totalAllowances += 60000 * allowanceMultiplier;
  
  // Spouse
  if (allowances.spouse) totalAllowances += 60000 * allowanceMultiplier;
  
  // Children
  totalAllowances += (allowances.children_1 || 0) * 30000 * allowanceMultiplier;
  totalAllowances += (allowances.children_2_plus || 0) * 60000 * allowanceMultiplier;
  
  // Parents (max 2)
  const parentsCount = Math.min((allowances.parents || 0), 2);
  totalAllowances += parentsCount * 30000 * allowanceMultiplier;
  
  // Disabled
  totalAllowances += (allowances.disabled || 0) * 60000 * allowanceMultiplier;

  // Life & Health Insurance (Self)
  const healthIns = Math.min(allowances.healthInsurance || 0, 25000);
  const lifeIns = Math.min(allowances.lifeInsurance || 0, 100000);
  totalAllowances += Math.min(healthIns + lifeIns, 100000);

  // Parents Health
  totalAllowances += Math.min(allowances.parentsHealthInsurance || 0, 15000);

  // Social Security
  totalAllowances += (allowances.socialSecurity || 0);
  
  // Home Loan
  totalAllowances += Math.min(allowances.homeLoanInterest || 0, 100000);

  // Retirement/Investment Group
  // SSF max 30% of total income, max 200k
  const ssfLimit = Math.min(totalIncome * 0.3, 200000);
  const ssfAllowed = Math.min(allowances.ssf || 0, ssfLimit);
  
  // RMF max 30% of total income, max 500k
  const rmfLimit = Math.min(totalIncome * 0.3, 500000);
  const rmfAllowed = Math.min(allowances.rmf || 0, rmfLimit);
  
  // Provident max 15% of income, max 500k
  const provLimit = Math.min(totalIncome * 0.15, 500000);
  const provAllowed = Math.min(allowances.providentFund || 0, provLimit);
  
  // Pension max 15% of income, max 200k
  const pensionLimit = Math.min(totalIncome * 0.15, 200000);
  const pensionAllowed = Math.min(allowances.pensionInsurance || 0, pensionLimit);

  // Group limit 500k
  const retirementTotal = ssfAllowed + rmfAllowed + provAllowed + pensionAllowed;
  totalAllowances += Math.min(retirementTotal, 500000);

  // Net Income before donations
  const netIncomeBeforeDonations = Math.max(0, incomeAfterExpenses - totalAllowances);

  // Donations
  // Education donation 2x, max 10% of netIncomeBeforeDonations
  const maxEduDonation = netIncomeBeforeDonations * 0.1;
  const eduDonationRequested = (allowances.educationDonation || 0) * 2;
  const educationDonationDeductible = Math.min(eduDonationRequested, maxEduDonation);

  const netAfterEdu = netIncomeBeforeDonations - educationDonationDeductible;

  // General donation max 10% of net after edu
  const maxGenDonation = netAfterEdu * 0.1;
  const generalDonationDeductible = Math.min(allowances.generalDonation || 0, maxGenDonation);

  const netTaxableIncome = Math.max(0, netAfterEdu - generalDonationDeductible);

  // 3. Tax Brackets Calculation
  let taxLiability = 0;
  const brackets: TaxBracket[] = [];
  let remainingIncome = netTaxableIncome;
  let previousMax = 0;

  for (const bracket of TAX_RATES) {
    const bracketSize = bracket.max ? bracket.max - previousMax : Infinity;
    const taxableInBracket = Math.min(Math.max(0, remainingIncome), bracketSize);
    
    const taxInBracket = taxableInBracket * bracket.rate;
    taxLiability += taxInBracket;
    
    brackets.push({
      min: bracket.min,
      max: bracket.max,
      rate: bracket.rate,
      taxableAmount: taxableInBracket,
      taxInBracket
    });

    remainingIncome -= taxableInBracket;
    if (bracket.max) previousMax = bracket.max;
    if (remainingIncome <= 0 && bracket.max !== null) {
      // Still populate remaining brackets with 0 for UI consistency
      if (!brackets.find(b => b.rate === bracket.rate)) {
        // already handled by loop
      }
    }
  }

  // fill remaining empty brackets
  const mappedBrackets = TAX_RATES.map(tr => {
    const found = brackets.find(b => b.min === tr.min);
    return found || {
      min: tr.min,
      max: tr.max,
      rate: tr.rate,
      taxableAmount: 0,
      taxInBracket: 0
    };
  });

  // Check filing obligation
  const isMarried = allowances.spouse || false;
  const hasSalaryOnly = inc.type40_1 > 0 && 
    inc.type40_2 === 0 && 
    inc.type40_3 === 0 && 
    inc.type40_4a === 0 && 
    inc.type40_4b === 0 && 
    inc.type40_5 === 0 && 
    inc.type40_6 === 0 && 
    inc.type40_7 === 0 && 
    inc.type40_8 === 0;

  let hasFilingObligation = false;
  let filingObligationReason = "";

  if (isMidYear) {
    const threshold = isMarried ? 120000 : 60000;
    const midYearIncome = inc.type40_5 + inc.type40_6 + inc.type40_7 + inc.type40_8;
    if (midYearIncome > threshold) {
      hasFilingObligation = true;
      filingObligationReason = `รายได้ 40(5)-40(8) ครึ่งปีแรก เกินเกณฑ์ขั้นต่ำ ${isMarried ? '120,000' : '60,000'} บาท สำหรับผู้มีคู่สมรส/โสด`;
    } else {
      filingObligationReason = `รายได้ครึ่งปีแรกไม่เกินเกณฑ์ขั้นต่ำ ${isMarried ? '120,000' : '60,000'} บาท`;
    }
  } else {
    if (hasSalaryOnly) {
      const threshold = isMarried ? 220000 : 120000;
      if (totalIncome > threshold) {
        hasFilingObligation = true;
        filingObligationReason = `รายได้เงินเดือนประจำ (40(1)) ทั้งปี เกินเกณฑ์ขั้นต่ำ ${isMarried ? '220,000' : '120,000'} บาท สำหรับผู้มีคู่สมรส/โสด`;
      } else {
        filingObligationReason = `รายได้เงินเดือนทั้งปีไม่เกินเกณฑ์ขั้นต่ำ ${isMarried ? '220,000' : '120,000'} บาท`;
      }
    } else {
      const threshold = isMarried ? 120000 : 60000;
      if (totalIncome > threshold) {
        hasFilingObligation = true;
        filingObligationReason = `รายได้รวมทุกประเภทรวมทั้งปี เกินเกณฑ์ขั้นต่ำ ${isMarried ? '120,000' : '60,000'} บาท สำหรับผู้มีคู่สมรส/โสด`;
      } else {
        filingObligationReason = `รายได้รวมทั้งปีไม่เกินเกณฑ์ขั้นต่ำ ${isMarried ? '120,000' : '60,000'} บาท`;
      }
    }
  }

  return {
    totalIncome,
    totalExpenses,
    incomeAfterExpenses,
    totalAllowances,
    netIncomeBeforeDonations,
    educationDonationDeductible,
    generalDonationDeductible,
    netTaxableIncome,
    taxLiability,
    brackets: mappedBrackets,
    hasFilingObligation,
    filingObligationReason
  };
}
