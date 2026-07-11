import { describe, it, expect } from 'vitest';
import { calculateTax } from './taxCalculation';

describe('Thai Tax Calculation Logic (taxCalculation.ts)', () => {
  
  it('should calculate zero tax for 300,000 THB standard salary with no extra allowances', () => {
    const result = calculateTax(
      { type40_1: 300000 }, // Salary
      {} // No extra allowances
    );

    // Expenses: 50% of 300k, capped at 100k => 100,000
    // Personal allowance: 60,000
    // Net taxable income: 300,000 - 100,000 - 60,000 = 140,000
    // Tax rate for 0 - 150k is 0%
    expect(result.totalIncome).toBe(300000);
    expect(result.totalExpenses).toBe(100000);
    expect(result.totalAllowances).toBe(60000); // Only personal allowance
    expect(result.netTaxableIncome).toBe(140000);
    expect(result.taxLiability).toBe(0);
  });

  it('should calculate correct progressive tax for 1,200,000 THB standard salary with no extra allowances', () => {
    const result = calculateTax(
      { type40_1: 1200000 },
      {}
    );

    // Expenses: capped at 100,000
    // Personal allowance: 60,000
    // Net taxable income: 1,200,000 - 100,000 - 60,000 = 1,040,000
    // Tax calculation:
    // 0 - 150,000 (0%): 0
    // 150,000 - 300,000 (5%): 150,000 * 0.05 = 7,500
    // 300,000 - 500,000 (10%): 200,000 * 0.10 = 20,000
    // 500,000 - 750,000 (15%): 250,000 * 0.15 = 37,500
    // 750,000 - 1,000,000 (20%): 250,000 * 0.20 = 50,000
    // 1,000,000 - 1,040,000 (25%): 40,000 * 0.25 = 10,000
    // Total: 0 + 7,500 + 20,000 + 37,500 + 50,000 + 10,000 = 125,000
    expect(result.netTaxableIncome).toBe(1040000);
    expect(result.taxLiability).toBe(125000);
  });

  it('should halve personal allowance for mid-year tax calculation (isMidYear = true)', () => {
    const result = calculateTax(
      { type40_5: 200000 }, // Rental income (30% expense rate)
      { spouse: true }, // Spouse allowance: 60,000, halved to 30,000
      true // isMidYear
    );

    // Expenses: 200,000 * 0.3 = 60,000
    // Personal allowance: 60,000 * 0.5 = 30,000
    // Spouse allowance: 60,000 * 0.5 = 30,000
    // Total allowance: 60,000
    // Net taxable income: 200,000 - 60,000 - 60,000 = 80,000
    // Tax liability: 0 (below 150,000)
    expect(result.totalExpenses).toBe(60000);
    expect(result.totalAllowances).toBe(60000);
    expect(result.netTaxableIncome).toBe(80000);
    expect(result.taxLiability).toBe(0);
  });

  it('should cap the retirement investment group at 500,000 THB', () => {
    const income = { type40_1: 2000000 }; // 2,000,000 THB
    // Allowances:
    // SSF: 250k (limit 30% of income = 600k, capped by SSF max 200k => 200k)
    // RMF: 400k (limit 30% of income = 600k, capped by RMF max 500k => 400k)
    // Pension: 100k (limit 15% of income = 300k, capped by Pension max 200k => 100k)
    // Total retirement requested: 200k + 400k + 100k = 700k. Capped by Retirement Group max 500k.
    const allowances = {
      ssf: 250000,
      rmf: 400000,
      pensionInsurance: 100000
    };

    const result = calculateTax(income, allowances);

    // Personal allowance: 60,000
    // Retirement group allowance: capped at 500,000
    // Total allowances should be: 60,000 + 500,000 = 560,000
    expect(result.totalAllowances).toBe(560000);
  });

  it('should apply donation deduction caps correctly', () => {
    // Income: 1,000,000
    // Expenses: 100,000
    // Personal allowance: 60,000
    // Net income before donations: 1,000,000 - 100,000 - 60,000 = 840,000
    //
    // Education donation: 100,000. 
    // Double deduction = 200,000.
    // Cap: 10% of net income before donations = 84,000.
    // Deductible education donation = 84,000.
    // Net after education donation = 840,000 - 84,000 = 756,000.
    //
    // General donation: 100,000.
    // Cap: 10% of net after education donation = 75,600.
    // Deductible general donation = 75,600.
    //
    // Net taxable income: 756,000 - 75,600 = 680,400.
    const result = calculateTax(
      { type40_1: 1000000 },
      {
        educationDonation: 100000,
        generalDonation: 100000
      }
    );

    expect(result.netIncomeBeforeDonations).toBe(840000);
    expect(result.educationDonationDeductible).toBe(84000);
    expect(result.generalDonationDeductible).toBe(75600);
    expect(result.netTaxableIncome).toBe(680400);
  });

  it('should calculate correct medical professional 40(6) income with 60% expense rate and zero tax', () => {
    const result = calculateTax(
      { type40_6: 500000, isMedicalProfession: true },
      {}
    );
    // Expense: 60% of 500k = 300,000
    // Personal allowance: 60,000
    // Net taxable: 500k - 300k - 60k = 140,000 (Exempt)
    expect(result.totalExpenses).toBe(300000);
    expect(result.netTaxableIncome).toBe(140000);
    expect(result.taxLiability).toBe(0);
    expect(result.hasFilingObligation).toBe(true); // > 60k threshold
  });

  it('should calculate correct non-medical professional 40(6) income with 30% expense rate', () => {
    const result = calculateTax(
      { type40_6: 500000, isMedicalProfession: false },
      {}
    );
    // Expense: 30% of 500k = 150,000
    // Personal: 60,000
    // Net: 500k - 150k - 60k = 290,000
    // Tax: 150k @ 0% (0) + 140k @ 5% (7,000) = 7,000
    expect(result.totalExpenses).toBe(150000);
    expect(result.netTaxableIncome).toBe(290000);
    expect(result.taxLiability).toBe(7000);
  });

  it('should calculate correct multi-income profile (Form 90) with family and housing deductions', () => {
    const result = calculateTax(
      { type40_1: 600000, type40_2: 200000, type40_3: 150000, type40_7: 300000, type40_8: 400000 },
      { parents: 2, disabled: 1, homeLoanInterest: 50000 }
    );
    // Expenses:
    // 40(1)+40(2) = 50% of 800k = 400k capped at 100k
    // 40(3) = 50% of 150k = 75k
    // 40(7) = 70% of 300k = 210k
    // 40(8) = 60% of 400k = 240k
    // Total expenses = 100k + 75k + 210k + 240k = 625,000
    // Allowances: Personal 60k + Parents (30k * 2 = 60k) + Disabled 60k + Home loan 50k = 230,000
    // Net taxable: 1,650,000 - 625,000 - 230,000 = 795,000
    // Tax: 0-150k (0), 150-300k (7.5k), 300-500k (20k), 500-750k (37.5k), 750-795k (45k * 20% = 9k)
    // Total tax = 74,000
    expect(result.totalIncome).toBe(1650000);
    expect(result.totalExpenses).toBe(625000);
    expect(result.totalAllowances).toBe(230000);
    expect(result.netTaxableIncome).toBe(795000);
    expect(result.taxLiability).toBe(74000);
  });

  it('should determine that low-income profile has no filing obligation', () => {
    const result = calculateTax(
      { type40_1: 100000 },
      {}
    );
    expect(result.hasFilingObligation).toBe(false);
    expect(result.taxLiability).toBe(0);
  });

  it('should calculate correct tax for high-net-worth individual in the 35% bracket with maximum allowances', () => {
    const result = calculateTax(
      { type40_1: 12000000 },
      { spouse: true, lifeInsurance: 100000, healthInsurance: 25000, homeLoanInterest: 100000, ssf: 200000, rmf: 300000, educationDonation: 200000, generalDonation: 100000 }
    );
    // Income: 12,000,000
    // Expenses: 100,000
    // Allowances: Personal 60k, Spouse 60k, Life+Health 100k, Home Loan 100k,SSf+Rmf capped at 500k -> Total 820,000
    // Net before donations: 11,080,000
    // Edu Donation: 200k * 2 = 400k (under 10% of 11.08M = 1.108M) -> Deduct 400,000
    // Gen Donation: 100k (under 10% of 10.68M = 1.068M) -> Deduct 100,000
    // Net taxable: 10,580,000
    // Tax calculation:
    // 0-5M is 1,265,000
    // 5.58M @ 35% is 1,953,000
    // Total: 3,218,000
    expect(result.totalAllowances).toBe(820000);
    expect(result.netTaxableIncome).toBe(10580000);
    expect(result.taxLiability).toBe(3218000);
  });
});
