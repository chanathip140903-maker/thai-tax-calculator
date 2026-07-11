import { calculateTax, formatTHB } from './src/lib/taxCalculation';

// Define a test case
const income = {
  type40_1: 1200000, // Monthly salary 100,000 THB -> 1,200,000 THB/year
  type40_5: 120000,  // Rental income -> 120,000 THB/year
  type40_6: 80000,   // Freelance work (medical profession = false) -> 80,000 THB/year
};

const allowances = {
  spouse: true,       // Spouse allowance: 60,000 THB
  children_1: 1,      // 1st child allowance: 30,000 THB
  lifeInsurance: 50000,
  healthInsurance: 15000,
  socialSecurity: 9000,
  ssf: 100000,
  educationDonation: 20000, // Double deduction -> 40,000 THB
};

console.log('==================================================');
console.log('        THAI TAX CALCULATION DEMO & TEST          ');
console.log('==================================================');
console.log('INPUT INCOME:');
console.log(`- 40(1) Salary:         ${formatTHB(income.type40_1)} THB`);
console.log(`- 40(5) Rental:         ${formatTHB(income.type40_5)} THB`);
console.log(`- 40(6) Freelance:      ${formatTHB(income.type40_6)} THB`);
console.log('--------------------------------------------------');
console.log('INPUT ALLOWANCES:');
console.log(`- Spouse:               ${allowances.spouse ? 'Yes (60,000 THB)' : 'No'}`);
console.log(`- Children:             ${allowances.children_1} child (30,000 THB)`);
console.log(`- Life Insurance:       ${formatTHB(allowances.lifeInsurance)} THB`);
console.log(`- Health Insurance:     ${formatTHB(allowances.healthInsurance)} THB`);
console.log(`- Social Security:      ${formatTHB(allowances.socialSecurity)} THB`);
console.log(`- SSF:                  ${formatTHB(allowances.ssf)} THB`);
console.log(`- Education Donation:   ${formatTHB(allowances.educationDonation)} THB (x2)`);

// Run calculation
const result = calculateTax(income, allowances);

console.log('==================================================');
console.log('CALCULATION BREAKDOWN:');
console.log(`Total Income:           ${formatTHB(result.totalIncome)} THB`);
console.log(`Total Expenses:        -${formatTHB(result.totalExpenses)} THB`);
console.log(`Income after Expenses:  ${formatTHB(result.incomeAfterExpenses)} THB`);
console.log(`Total Allowances:      -${formatTHB(result.totalAllowances)} THB`);
console.log(`Net before Donations:   ${formatTHB(result.netIncomeBeforeDonations)} THB`);
console.log(`Edu Donation Deduct:   -${formatTHB(result.educationDonationDeductible)} THB`);
console.log(`Gen Donation Deduct:   -${formatTHB(result.generalDonationDeductible)} THB`);
console.log('--------------------------------------------------');
console.log(`Net Taxable Income:     ${formatTHB(result.netTaxableIncome)} THB`);
console.log(`Total Tax Liability:    ${formatTHB(result.taxLiability)} THB`);
console.log('==================================================');
console.log('TAX BRACKETS DETAILED BREAKDOWN:');

result.brackets.forEach(bracket => {
  const range = bracket.max 
    ? `${formatTHB(bracket.min).padStart(12)} - ${formatTHB(bracket.max).padEnd(12)}`
    : `${formatTHB(bracket.min).padStart(12)} and above       `;
  
  const ratePct = `${(bracket.rate * 100).toFixed(0)}%`.padStart(4);
  const tax = formatTHB(bracket.taxInBracket).padStart(12);
  
  if (bracket.taxInBracket > 0 || bracket.min === 0) {
    console.log(`Bracket: [${range}] | Rate: ${ratePct} | Tax: ${tax} THB`);
  }
});
console.log('==================================================');
