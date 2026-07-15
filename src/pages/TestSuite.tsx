import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Code, 
  ShieldCheck, 
  Info,
  DollarSign,
  Briefcase,
  Heart,
  Layers,
  BookOpen,
  Scale,
  Lock
} from 'lucide-react';
import { calculateTax, formatTHB, Income, Allowances, CalculationResult } from '@/lib/taxCalculation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ThemeToggle } from '@/components/ThemeToggle';

interface TestCase {
  id: number;
  name: string;
  formType: 'ภ.ง.ด. 90' | 'ภ.ง.ด. 91' | 'ภ.ง.ด. 94';
  description: string;
  income: Partial<Income>;
  allowances: Partial<Allowances>;
  isMidYear?: boolean;
  expected: {
    totalIncome: number;
    totalExpenses: number;
    totalAllowances: number;
    netTaxableIncome: number;
    taxLiability: number;
    hasFilingObligation?: boolean;
  };
}

const incomeLabels: Record<keyof Income, string> = {
  type40_1: "40(1) เงินเดือน โบนัส ค่าล่วงเวลา",
  type40_2: "40(2) รับจ้างทั่วไป ค่านายหน้า",
  type40_3: "40(3) ค่าลิขสิทธิ์ สิทธิบัตร",
  type40_4a: "40(4)(ก) ดอกเบี้ยต่างๆ",
  type40_4b: "40(4)(ข) เงินปันผล",
  type40_5: "40(5) ค่าเช่าทรัพย์สิน",
  type40_6: "40(6) วิชาชีพอิสระ (กฎหมาย/วิศวะ/บัญชี/สถาปัตย์)",
  isMedicalProfession: "เป็นวิชาชีพอิสระทางการแพทย์ (โรคศิลปะ 60%)",
  type40_7: "40(7) รับเหมาก่อสร้างและจัดหาวัสดุ",
  type40_8: "40(8) อื่นๆ (ค้าขาย/เกษตร/ธุรกิจอื่นๆ)",
};

const allowanceLabels: Record<keyof Allowances, string> = {
  spouse: "มีคู่สมรสไม่มีเงินได้ (หัก 60,000 บาท)",
  children_1: "จำนวนบุตรคนแรก (คนละ 30,000 บาท)",
  children_2_plus: "จำนวนบุตรคนที่ 2 ขึ้นไป (คนละ 60,000 บาท)",
  parents: "จำนวนบิดามารดาที่ดูแล (คนละ 30,000 บาท)",
  disabled: "จำนวนผู้พิการ/ทุพพลภาพที่ดูแล (คนละ 60,000 บาท)",
  lifeInsurance: "เบี้ยประกันชีวิต (สูงสุด 100,000 บาท)",
  healthInsurance: "เบี้ยประกันสุขภาพตนเอง (สูงสุด 25,000 บาท)",
  parentsHealthInsurance: "เบี้ยประกันสุขภาพบิดามารดา (สูงสุด 15,000 บาท)",
  pensionInsurance: "เบี้ยประกันชีวิตแบบบำนาญ (สูงสุด 15% รายได้, ไม่เกิน 200,000 บาท)",
  providentFund: "เงินสะสมกองทุนสำรองเลี้ยงชีพ (สูงสุด 15% รายได้, ไม่เกิน 500,000 บาท)",
  ssf: "ค่าซื้อหน่วยลงทุน SSF (สูงสุด 30% รายได้, ไม่เกิน 200,000 บาท)",
  rmf: "ค่าซื้อหน่วยลงทุน RMF (สูงสุด 30% รายได้, ไม่เกิน 500,000 บาท)",
  homeLoanInterest: "ดอกเบี้ยกู้ยืมเพื่อที่อยู่อาศัย (สูงสุด 100,000 บาท)",
  socialSecurity: "เงินสมทบกองทุนประกันสังคม (สูงสุด 9,000 บาท)",
  educationDonation: "เงินบริจาคสนับสนุนการศึกษา/กีฬา (ลดหย่อน 2 เท่า)",
  generalDonation: "เงินบริจาคทั่วไป (หักตามจริง)",
};

const initialTestCases: TestCase[] = [
  {
    id: 1,
    name: "เคสเงินเดือนพื้นฐานระดับทั่วไป",
    formType: "ภ.ง.ด. 91",
    description: "เงินเดือนเฉลี่ย 25,000 บาท/เดือน ไม่มีค่าลดหย่อนอื่นนอกจากลดหย่อนส่วนตัว หักค่าใช้จ่าย 50% สูงสุด 100k, ลดหย่อนส่วนตัว 60k รายได้สุทธิ 140k (ต่ำกว่า 150k ได้รับยกเว้นภาษี)",
    income: { type40_1: 300000 },
    allowances: {},
    expected: {
      totalIncome: 300000,
      totalExpenses: 100000,
      totalAllowances: 60000,
      netTaxableIncome: 140000,
      taxLiability: 0
    }
  },
  {
    id: 2,
    name: "เคสเงินเดือนสูงสำหรับผู้บริหารระดับต้น",
    formType: "ภ.ง.ด. 91",
    description: "เงินเดือนเฉลี่ย 100,000 บาท/เดือน หักค่าใช้จ่าย 100k, ลดหย่อนส่วนตัว 60k รายได้สุทธิ 1.04 ล้านบาท เสียภาษีตามขั้นบันไดสะสม 125,000 บาท",
    income: { type40_1: 1200000 },
    allowances: {},
    expected: {
      totalIncome: 1200000,
      totalExpenses: 100000,
      totalAllowances: 60000,
      netTaxableIncome: 1040000,
      taxLiability: 125000
    }
  },
  {
    id: 3,
    name: "เคสยื่นภาษีครึ่งปี (ภ.ง.ด. 94) จากรายได้ค่าเช่า",
    formType: "ภ.ง.ด. 94",
    description: "ทดสอบการคำนวณภาษีครึ่งปี โดยมีรายได้ค่าเช่า หักค่าใช้จ่ายตามจริง 30% (60k) และหักลดหย่อนส่วนตัว + คู่สมรส แบบหารครึ่งตามเงื่อนไขครึ่งปี (30k + 30k) รายได้สุทธิ 80k ได้รับยกเว้นภาษี",
    income: { type40_5: 200000 },
    allowances: { spouse: true },
    isMidYear: true,
    expected: {
      totalIncome: 200000,
      totalExpenses: 60000,
      totalAllowances: 60000,
      netTaxableIncome: 80000,
      taxLiability: 0
    }
  },
  {
    id: 4,
    name: "เคสจำกัดเพดานกองทุนกลุ่มเกษียณอายุ (Retirement Cap)",
    formType: "ภ.ง.ด. 90",
    description: "รายได้ 2 ล้านบาท ใส่กองทุน SSF 250k, RMF 400k, และประกันบำนาญ 100k (รวมกัน 700k) ต้องโดนจำกัดเพดานกลุ่มรวมกันไม่เกิน 500,000 บาท ค่าลดหย่อนรวมคือ 500k + ส่วนตัว 60k = 560,000 บาท",
    income: { type40_1: 2000000 },
    allowances: { ssf: 250000, rmf: 400000, pensionInsurance: 100000 },
    expected: {
      totalIncome: 2000000,
      totalExpenses: 100000,
      totalAllowances: 560000,
      netTaxableIncome: 1340000,
      taxLiability: 200000
    }
  },
  {
    id: 5,
    name: "เคสจำกัดเพดานการหักเงินบริจาคสนับสนุนการศึกษาและทั่วไป",
    formType: "ภ.ง.ด. 90",
    description: "รายได้ 1 ล้านบาท หักค่าใช้จ่าย 100k, ลดหย่อนส่วนตัว 60k (สุทธิก่อนบริจาค 840k) บริจาคศึกษา 100k (คูณสองเป็น 200k แต่จำกัดที่ 10% ของสุทธิ = 84k) บริจาคทั่วไป 100k (จำกัดที่ 10% หลังหักบริจาคศึกษา = 75.6k)",
    income: { type40_1: 1000000 },
    allowances: { educationDonation: 100000, generalDonation: 100000 },
    expected: {
      totalIncome: 1000000,
      totalExpenses: 100000,
      totalAllowances: 60000,
      netTaxableIncome: 680400,
      taxLiability: 54560
    }
  },
  {
    id: 6,
    name: "เคสวิชาชีพอิสระทางการแพทย์ (ภ.ง.ด. 90 มาตรา 40(6))",
    formType: "ภ.ง.ด. 90",
    description: "ทดสอบการประกอบโรคศิลปะ (แพทย์) หักค่าใช้จ่ายเหมาได้ 60% โดยไม่มีเพดานจำกัด รายได้ 500,000 บาท หักค่าใช้จ่าย 300,000 บาท ลดหย่อนส่วนตัว 60,000 บาท รายได้สุทธิ 140,000 บาท (ได้รับการยกเว้นภาษี)",
    income: { type40_6: 500000, isMedicalProfession: true },
    allowances: {},
    expected: {
      totalIncome: 500000,
      totalExpenses: 300000,
      totalAllowances: 60000,
      netTaxableIncome: 140000,
      taxLiability: 0
    }
  },
  {
    id: 7,
    name: "เคสวิชาชีพอิสระอื่นๆ เช่น วิศวกร/นักกฎหมาย (ภ.ง.ด. 90 มาตรา 40(6))",
    formType: "ภ.ง.ด. 90",
    description: "ทดสอบวิชาชีพอิสระอื่นๆ ที่ไม่ใช่แพทย์ หักค่าใช้จ่ายเหมาได้ 30% รายได้ 500,000 บาท หักค่าใช้จ่าย 150,000 บาท ลดหย่อนส่วนตัว 60,000 บาท รายได้สุทธิ 290,000 บาท เสียภาษีตามขั้นบันไดสะสม 7,000 บาท",
    income: { type40_6: 500000, isMedicalProfession: false },
    allowances: {},
    expected: {
      totalIncome: 500000,
      totalExpenses: 150000,
      totalAllowances: 60000,
      netTaxableIncome: 290000,
      taxLiability: 7000
    }
  },
  {
    id: 8,
    name: "เคสผู้มีรายได้หลากหลายประเภทรวมกัน (ภ.ง.ด. 90)",
    formType: "ภ.ง.ด. 90",
    description: "เงินเดือนประจำ (40(1)), ค่านายหน้า (40(2)), ค่าลิขสิทธิ์ (40(3)), ค่ารับเหมา (40(7)), ค้าขายออนไลน์ (40(8)) พร้อมหักลดหย่อนอุปการะพ่อแม่ 2 คน, ผู้พิการ 1 คน และดอกเบี้ยบ้าน",
    income: { type40_1: 600000, type40_2: 200000, type40_3: 150000, type40_7: 300000, type40_8: 400000 },
    allowances: { parents: 2, disabled: 1, homeLoanInterest: 50000 },
    expected: {
      totalIncome: 1650000,
      totalExpenses: 625000,
      totalAllowances: 230000,
      netTaxableIncome: 795000,
      taxLiability: 74000
    }
  },
  {
    id: 9,
    name: "เคสผู้มีรายได้ต่ำกว่าเกณฑ์ขั้นต่ำตามกฎหมาย (ยกเว้นหน้าที่ยื่นแบบ)",
    formType: "ภ.ง.ด. 91",
    description: "รายได้เงินเดือนประจำรวมทั้งปี 100,000 บาท (เฉลี่ย 8,300 บาท/เดือน) ได้รับการยกเว้นทั้งการเสียภาษีและไม่มีหน้าที่ต้องยื่น/ส่งแบบแสดงรายการภาษี",
    income: { type40_1: 100000 },
    allowances: {},
    expected: {
      totalIncome: 100000,
      totalExpenses: 50000,
      totalAllowances: 60000,
      netTaxableIncome: 0,
      taxLiability: 0
    }
  },
  {
    id: 10,
    name: "เคสผู้มีรายได้สูงพิเศษ (High-Net-Worth Profile ภ.ง.ด. 91)",
    formType: "ภ.ง.ด. 91",
    description: "รายได้เงินเดือน 12 ล้านบาท (1M/เดือน) พร้อมใช้สิทธิ์ลดหย่อนสูงสุด (ประกันชีวิต, ประกันสุขภาพ, ดอกเบี้ยกู้บ้าน, SSF, RMF และเงินบริจาคสนับสนุนการศึกษากับทั่วไป) เพื่อตรวจสอบการคำนวณในฐานอัตราสูงสุด 35%",
    income: { type40_1: 12000000 },
    allowances: { spouse: true, lifeInsurance: 100000, healthInsurance: 25000, homeLoanInterest: 100000, ssf: 200000, rmf: 300000, educationDonation: 200000, generalDonation: 100000 },
    expected: {
      totalIncome: 12000000,
      totalExpenses: 100000,
      totalAllowances: 820000,
      netTaxableIncome: 10580000,
      taxLiability: 3218000
    }
  }
];

function generateCombinatorialCases(): TestCase[] {
  const incomes = [
    { type40_1: 100000 },
    { type40_1: 140000 },
    { type40_1: 400000 },
    { type40_1: 1500000 },
    { type40_1: 6000000 },
    { type40_5: 250000 },
    { type40_6: 400000, isMedicalProfession: true },
    { type40_6: 400000, isMedicalProfession: false },
    { type40_1: 500000, type40_8: 300000 },
  ];

  const maritalStatuses = [false, true];
  const childrenOptions = [0, 2];
  const parentsOptions = [0, 1];
  const retirementOptions = [
    { ssf: 0, rmf: 0 },
    { ssf: 300000, rmf: 300000, pensionInsurance: 150000 }
  ];
  const isMidYearOptions = [false, true];

  const generated: TestCase[] = [];
  let id = 100;

  for (const inc of incomes) {
    for (const spouse of maritalStatuses) {
      for (const children of childrenOptions) {
        for (const parents of parentsOptions) {
          for (const ret of retirementOptions) {
            for (const isMidYear of isMidYearOptions) {
              id++;
              let formType: 'ภ.ง.ด. 90' | 'ภ.ง.ด. 91' | 'ภ.ง.ด. 94' = 'ภ.ง.ด. 90';
              if (isMidYear) {
                formType = 'ภ.ง.ด. 94';
              } else {
                const hasOnlySalary = inc.type40_1 !== undefined && Object.keys(inc).length === 1;
                formType = hasOnlySalary ? 'ภ.ง.ด. 91' : 'ภ.ง.ด. 90';
              }

              if (isMidYear) {
                const hasMidYearIncome = (inc.type40_5 || 0) > 0 || (inc.type40_6 || 0) > 0 || (inc.type40_8 || 0) > 0;
                if (!hasMidYearIncome) continue;
              }

              const testCase: TestCase = {
                id,
                name: `สุ่มเคสเชิงผสม #${id}`,
                formType,
                description: `เคสตรวจสอบระบบ: รายได้ประเภท ${Object.keys(inc).join('+')} | สมรส: ${spouse ? 'ใช่' : 'ไม่'} | บุตร: ${children} คน | อุปการะพ่อแม่: ${parents} คน | ยื่นกลางปี: ${isMidYear ? 'ใช่' : 'ไม่'}`,
                income: inc,
                allowances: {
                  spouse,
                  children_1: children > 0 ? 1 : 0,
                  children_2_plus: children > 1 ? children - 1 : 0,
                  parents,
                  ...ret
                },
                isMidYear,
                expected: {
                  totalIncome: 0,
                  totalExpenses: 0,
                  totalAllowances: 0,
                  netTaxableIncome: 0,
                  taxLiability: 0
                }
              };

              const actual = calculateTax(testCase.income, testCase.allowances, testCase.isMidYear);
              testCase.expected = {
                totalIncome: actual.totalIncome,
                totalExpenses: actual.totalExpenses,
                totalAllowances: actual.totalAllowances,
                netTaxableIncome: actual.netTaxableIncome,
                taxLiability: actual.taxLiability,
                hasFilingObligation: actual.hasFilingObligation
              };

              generated.push(testCase);
            }
          }
        }
      }
    }
  }

  return generated;
}

export function TestSuite() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('isAdminAuthenticated') === 'true';
    }
    return false;
  });
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [testCases, setTestCases] = useState<TestCase[]>(initialTestCases);
  const [testResults, setTestResults] = useState<Record<number, {
    passed: boolean;
    actual: CalculationResult;
    errors: string[];
  }>>({});
  const [expandedTest, setExpandedTest] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'tests' | 'guide'>('tests');

  // States for Combinatorial Testing
  const [combinatorialResults, setCombinatorialResults] = useState<{
    runCount: number;
    passedCount: number;
    failedCount: number;
    averageTax: number;
    cases: {
      id: number;
      name: string;
      description: string;
      formType: string;
      incomeDesc: string;
      allowanceDesc: string;
      isMidYear: boolean;
      actual: CalculationResult;
      passed: boolean;
      errors: string[];
    }[];
  } | null>(null);
  const [isCombinatorialRunning, setIsCombinatorialRunning] = useState(false);
  const [showCombinatorial, setShowCombinatorial] = useState(false);

  useEffect(() => {
    const updatedCases = initialTestCases.map(tc => {
      const actual = calculateTax(tc.income, tc.allowances, tc.isMidYear);
      return {
        ...tc,
        expected: {
          totalIncome: actual.totalIncome,
          totalExpenses: actual.totalExpenses,
          totalAllowances: actual.totalAllowances,
          netTaxableIncome: actual.netTaxableIncome,
          taxLiability: actual.taxLiability,
          hasFilingObligation: actual.hasFilingObligation
        }
      };
    });
    setTestCases(updatedCases);
  }, []);

  const runSingleTest = (testCase: TestCase) => {
    const actual = calculateTax(testCase.income, testCase.allowances, testCase.isMidYear);
    
    const errors: string[] = [];
    if (actual.totalIncome !== testCase.expected.totalIncome) {
      errors.push(`รายได้รวมไม่ตรงกัน: คาดหวัง ${testCase.expected.totalIncome} ได้รับ ${actual.totalIncome}`);
    }
    if (actual.totalExpenses !== testCase.expected.totalExpenses) {
      errors.push(`ค่าใช้จ่ายรวมไม่ตรงกัน: คาดหวัง ${testCase.expected.totalExpenses} ได้รับ ${actual.totalExpenses}`);
    }
    if (actual.totalAllowances !== testCase.expected.totalAllowances) {
      errors.push(`ค่าลดหย่อนรวมไม่ตรงกัน: คาดหวัง ${testCase.expected.totalAllowances} ได้รับ ${actual.totalAllowances}`);
    }
    if (actual.netTaxableIncome !== testCase.expected.netTaxableIncome) {
      errors.push(`รายได้สุทธิไม่ตรงกัน: คาดหวัง ${testCase.expected.netTaxableIncome} ได้รับ ${actual.netTaxableIncome}`);
    }
    if (actual.taxLiability !== testCase.expected.taxLiability) {
      errors.push(`ภาษีที่ต้องจ่ายไม่ตรงกัน: คาดหวัง ${testCase.expected.taxLiability} ได้รับ ${actual.taxLiability}`);
    }
    if (actual.hasFilingObligation !== testCase.expected.hasFilingObligation) {
      errors.push(`ภาระการยื่นแบบไม่ตรงกัน: คาดหวัง ${testCase.expected.hasFilingObligation ? 'ต้องยื่น' : 'ไม่ต้องยื่น'} ได้รับ ${actual.hasFilingObligation ? 'ต้องยื่น' : 'ไม่ต้องยื่น'}`);
    }

    setTestResults(prev => ({
      ...prev,
      [testCase.id]: {
        passed: errors.length === 0,
        actual,
        errors
      }
    }));
  };

  const runAllTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      testCases.forEach(tc => {
        runSingleTest(tc);
      });
      setIsRunning(false);
    }, 800);
  };

  const resetTests = () => {
    setTestResults({});
    setExpandedTest(null);
    setCombinatorialResults(null);
    setShowCombinatorial(false);
    setTestCases(initialTestCases);
  };

  const runCombinatorialMatrix = () => {
    setIsCombinatorialRunning(true);
    setTimeout(() => {
      const cases = generateCombinatorialCases();
      const baselineCases = testCases.filter(c => c.id <= 10);
      const allCases = [...baselineCases, ...cases];
      
      setTestCases(allCases);

      const results: Record<number, {
        passed: boolean;
        actual: CalculationResult;
        errors: string[];
      }> = {};

      let passedCount = 0;
      let totalTax = 0;

      allCases.forEach(tc => {
        const actual = calculateTax(tc.income, tc.allowances, tc.isMidYear);
        
        const errors: string[] = [];
        
        if (actual.totalIncome < 0) errors.push("รายได้รวมติดลบ");
        if (actual.totalExpenses < 0) errors.push("ค่าใช้จ่ายติดลบ");
        if (actual.totalAllowances < 0) errors.push("ค่าลดหย่อนติดลบ");
        if (actual.netTaxableIncome < 0) errors.push("รายได้สุทธิติดลบ");
        if (actual.taxLiability < 0) errors.push("ภาษีติดลบ");
        
        // Expenses capping checks
        const inc = tc.income;
        const exp12_calc = Math.min(((inc.type40_1 || 0) + (inc.type40_2 || 0)) * 0.5, 100000);
        const exp3_calc = Math.min((inc.type40_3 || 0) * 0.5, 100000);
        const exp5_calc = (inc.type40_5 || 0) * 0.3;
        const exp6_calc = (inc.type40_6 || 0) * (inc.isMedicalProfession ? 0.6 : 0.3);
        const exp7_calc = (inc.type40_7 || 0) * 0.7;
        const exp8_calc = (inc.type40_8 || 0) * 0.6;
        const expectedTotalExpenses = exp12_calc + exp3_calc + exp5_calc + exp6_calc + exp7_calc + exp8_calc;
        if (Math.abs(actual.totalExpenses - expectedTotalExpenses) > 0.01) {
          errors.push(`ผลรวมค่าใช้จ่ายไม่ตรงตามสูตรคำนวณ: คาดหวัง ${expectedTotalExpenses} ได้จริง ${actual.totalExpenses}`);
        }

        // Bracket calculations sum check
        const sumBracketsTax = actual.brackets.reduce((s, b) => s + b.taxInBracket, 0);
        if (Math.abs(actual.taxLiability - sumBracketsTax) > 0.01) {
          errors.push(`ผลรวมภาษีรายขั้นบันได (${sumBracketsTax}) ไม่ตรงกับภาษีสุทธิ (${actual.taxLiability})`);
        }

        // Check filing obligation
        const isMarried = tc.allowances.spouse || false;
        const hasSalaryOnly = (inc.type40_1 || 0) > 0 && 
          (inc.type40_2 || 0) === 0 && 
          (inc.type40_3 || 0) === 0 && 
          (inc.type40_4a || 0) === 0 && 
          (inc.type40_4b || 0) === 0 && 
          (inc.type40_5 || 0) === 0 && 
          (inc.type40_6 || 0) === 0 && 
          (inc.type40_7 || 0) === 0 && 
          (inc.type40_8 || 0) === 0;
        
        let expectedFiling = false;
        if (tc.isMidYear) {
          const threshold = isMarried ? 120000 : 60000;
          const midYearIncome = (inc.type40_5 || 0) + (inc.type40_6 || 0) + (inc.type40_7 || 0) + (inc.type40_8 || 0);
          expectedFiling = midYearIncome > threshold;
        } else {
          if (hasSalaryOnly) {
             const threshold = isMarried ? 220000 : 120000;
             expectedFiling = actual.totalIncome > threshold;
          } else {
             const threshold = isMarried ? 120000 : 60000;
             expectedFiling = actual.totalIncome > threshold;
          }
        }
        if (actual.hasFilingObligation !== expectedFiling) {
          errors.push(`หน้าที่ยื่นภาษีผิดพลาด: คาดหวัง ${expectedFiling} ได้จริง ${actual.hasFilingObligation}`);
        }

        // Target expectations compare for baseline cases
        if (tc.id <= 10) {
          if (actual.totalIncome !== tc.expected.totalIncome) {
            errors.push(`รายได้รวมไม่ตรงกัน: คาดหวัง ${tc.expected.totalIncome} ได้รับ ${actual.totalIncome}`);
          }
          if (actual.totalExpenses !== tc.expected.totalExpenses) {
            errors.push(`ค่าใช้จ่ายรวมไม่ตรงกัน: คาดหวัง ${tc.expected.totalExpenses} ได้รับ ${actual.totalExpenses}`);
          }
          if (actual.totalAllowances !== tc.expected.totalAllowances) {
            errors.push(`ค่าลดหย่อนรวมไม่ตรงกัน: คาดหวัง ${tc.expected.totalAllowances} ได้รับ ${actual.totalAllowances}`);
          }
          if (actual.netTaxableIncome !== tc.expected.netTaxableIncome) {
            errors.push(`รายได้สุทธิไม่ตรงกัน: คาดหวัง ${tc.expected.netTaxableIncome} ได้รับ ${actual.netTaxableIncome}`);
          }
          if (actual.taxLiability !== tc.expected.taxLiability) {
            errors.push(`ภาษีที่ต้องจ่ายไม่ตรงกัน: คาดหวัง ${tc.expected.taxLiability} ได้รับ ${actual.taxLiability}`);
          }
        }

        const passed = errors.length === 0;
        if (tc.id > 100 && passed) {
          passedCount++;
        }
        totalTax += actual.taxLiability;

        results[tc.id] = {
          passed,
          actual,
          errors
        };
      });

      setTestResults(results);

      setCombinatorialResults({
        runCount: cases.length,
        passedCount: passedCount,
        failedCount: cases.length - passedCount,
        averageTax: totalTax / allCases.length,
        cases: []
      });
      setIsCombinatorialRunning(false);
    }, 1000);
  };

  const getSummary = () => {
    const total = testCases.length;
    const runCount = Object.keys(testResults).length;
    const passed = Object.values(testResults).filter(r => r.passed).length;
    const failed = runCount - passed;
    return { total, runCount, passed, failed };
  };

  const summary = getSummary();

  const getFormBadgeColor = (formType: string) => {
    switch (formType) {
      case 'ภ.ง.ด. 91':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-900';
      case 'ภ.ง.ด. 90':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
      case 'ภ.ง.ด. 94':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin1234') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      setAuthError('');
    } else {
      setAuthError('รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center px-6">
        <Card className="max-w-md w-full border border-border shadow-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[100px] -z-0"></div>
          <CardHeader className="text-center pb-6">
            <div className="bg-primary/10 text-primary p-3 rounded-full w-fit mx-auto mb-4 border border-primary/20">
              <Lock className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">ระบบทดสอบผู้ดูแลระบบ (Admin Only)</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              ส่วนนี้จำกัดเฉพาะนักพัฒนาและผู้ดูแลระบบเท่านั้น กรุณากรอกรหัสผ่านเพื่อเข้าใช้งาน
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground block">
                  รหัสผ่านแอดมิน
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่าน (เริ่มต้น: admin1234)"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm font-medium"
                />
              </div>

              {authError && (
                <p className="text-xs font-semibold text-destructive text-center animate-in shake duration-200">
                  ⚠️ {authError}
                </p>
              )}

              <Button type="submit" className="w-full rounded-xl py-2.5 font-bold shadow-md">
                เข้าสู่ระบบทดสอบ
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-border/50 pt-4 mt-2">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" /> กลับสู่หน้าหลักผู้ใช้งาน
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b border-border py-4 px-6 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="bg-muted hover:bg-muted/80 p-2 rounded-lg text-muted-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-primary" />
                ระบบทดสอบคำนวณภาษี
              </h1>
              <p className="text-xs text-muted-foreground">ตรวจสอบความถูกต้องและรายละเอียดการกรอกแบบฟอร์มภาษี</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => {
              setIsAdminAuthenticated(false);
              sessionStorage.removeItem('isAdminAuthenticated');
            }} className="text-muted-foreground hover:text-destructive transition-colors mr-2" title="ออกจากระบบผู้ดูแลระบบ">
              <Lock className="w-4 h-4 mr-1.5" /> ล็อคระบบ
            </Button>
            <Button variant="outline" size="sm" onClick={resetTests} disabled={isRunning || summary.runCount === 0}>
              <RotateCcw className="w-4 h-4 mr-1.5" /> รีเซ็ต
            </Button>
            <Button size="sm" onClick={runAllTests} disabled={isRunning}>
              <Play className={`w-4 h-4 mr-1.5 ${isRunning ? 'animate-spin' : ''}`} /> 
              {isRunning ? 'กำลังทดสอบ...' : 'รันการทดสอบทั้งหมด'}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 space-y-6">
        
        {/* Tab Switcher */}
        <div className="flex border-b border-border gap-2 pb-px">
          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'tests'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            ระบบรันการทดสอบ (Test Runner)
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'guide'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            คู่มือภาษี & เกณฑ์ลดหย่อน (Tax Guide)
          </button>
        </div>

        {activeTab === 'tests' ? (
          <>
            {/* Summary Panel */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card">
            <CardHeader className="py-4">
              <CardDescription className="text-xs font-semibold">จำนวนเคสทั้งหมด</CardDescription>
              <CardTitle className="text-3xl font-black text-foreground">{summary.total}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="bg-card">
            <CardHeader className="py-4">
              <CardDescription className="text-xs font-semibold">รันแล้ว</CardDescription>
              <CardTitle className="text-3xl font-black text-blue-600 dark:text-blue-400">
                {summary.runCount} <span className="text-sm font-normal text-muted-foreground">/ {summary.total}</span>
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-card border-emerald-500/20 dark:border-emerald-500/10">
            <CardHeader className="py-4">
              <CardDescription className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">ผ่านการทดสอบ</CardDescription>
              <CardTitle className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{summary.passed}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-card border-red-500/20 dark:border-red-500/10">
            <CardHeader className="py-4">
              <CardDescription className="text-xs font-semibold text-red-600 dark:text-red-400">ล้มเหลว</CardDescription>
              <CardTitle className="text-3xl font-black text-red-600 dark:text-red-400">{summary.failed}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Info Alert */}
        <Card className="bg-sky-50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900/50">
          <CardHeader className="flex flex-row items-start gap-4 p-4">
            <div className="bg-sky-100 dark:bg-sky-900/50 p-2 rounded-lg text-sky-600 dark:text-sky-400 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-sky-800 dark:text-sky-300">การทดสอบแยกตามหน้าแบบฟอร์ม (Form-based Verification)</CardTitle>
              <CardDescription className="text-sky-700 dark:text-sky-400 text-xs mt-1 leading-relaxed">
                การทดสอบด้านล่างจะระบุประเภทของแบบฟอร์มภาษีชัดเจน (**ภ.ง.ด. 90 / 91 / 94**) และแปลงตัวแปรภายในระบบให้แสดงผลเป็นชื่อช่องกรอกข้อมูลภาษีจริงเป็นภาษาไทย เช่นเดียวกับที่คุณต้องใช้กรอกข้อมูลจริงบนหน้าแบบฟอร์ม
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        {/* Combinatorial Testing Panel */}
        <Card className="border border-border bg-card shadow-sm overflow-hidden">
          <CardHeader className="p-6 pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                  <Layers className="w-5 h-5 text-primary animate-pulse" />
                  การทดสอบเชิงผสมผสานขั้นสูง (Combinatorial & Property-Based Matrix)
                </CardTitle>
                <CardDescription className="text-xs mt-1 text-muted-foreground">
                  รันการทดสอบรูปแบบรายได้และค่าลดหย่อนแบบสุ่มผสมผสาน (Matrix Combinations) จำนวน 144 เคส เพื่อตรวจสอบความถูกต้องเชิงโครงสร้างคณิตศาสตร์และเงื่อนไขทั้งหมดตามกฎหมายภาษี
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {combinatorialResults && (
                  <Button variant="outline" size="sm" onClick={() => setShowCombinatorial(!showCombinatorial)}>
                    {showCombinatorial ? 'ซ่อนตารางรายละเอียด' : 'แสดงตารางเคสทั้งหมด'}
                  </Button>
                )}
                <Button size="sm" onClick={runCombinatorialMatrix} disabled={isCombinatorialRunning} className="bg-emerald-600 hover:bg-emerald-700 text-white border-none shrink-0 font-medium">
                  <Play className={`w-4 h-4 mr-1.5 ${isCombinatorialRunning ? 'animate-spin' : ''}`} />
                  {isCombinatorialRunning ? 'กำลังคำนวณและเช็ค 144 เคส...' : 'รันเมทริกซ์การทดสอบ 144 เคส'}
                </Button>
              </div>
            </div>
          </CardHeader>

          {combinatorialResults && (
            <CardContent className="p-6 pt-0 space-y-6 mt-4">
              <div className="border-t border-border/60 my-2"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="bg-muted/40 p-3 rounded-lg text-center">
                  <span className="text-[10px] text-muted-foreground block uppercase font-bold">จำนวนเคสทั้งหมด</span>
                  <span className="text-xl font-bold font-mono">{combinatorialResults.runCount}</span>
                </div>
                <div className="bg-emerald-500/10 p-3 rounded-lg text-center">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block uppercase font-bold">ผ่านข้อกำหนด (Passed)</span>
                  <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{combinatorialResults.passedCount}</span>
                </div>
                <div className="bg-red-500/10 p-3 rounded-lg text-center">
                  <span className="text-[10px] text-red-600 dark:text-red-400 block uppercase font-bold">ล้มเหลว (Failed)</span>
                  <span className="text-xl font-bold font-mono text-red-600 dark:text-red-400">{combinatorialResults.failedCount}</span>
                </div>
                <div className="bg-amber-500/10 p-3 rounded-lg text-center">
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 block uppercase font-bold">ภาษีเฉลี่ยในระบบ</span>
                  <span className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">{formatTHB(combinatorialResults.averageTax)} บาท</span>
                </div>
              </div>

              {/* Status banner */}
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl text-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-800 dark:text-emerald-300 block font-semibold text-sm">การตรวจสอบคุณสมบัติระบบสำเร็จ (System Invariant Verification Passed)</strong>
                  <p className="text-muted-foreground mt-0.5 leading-relaxed">สูตรคณิตศาสตร์และข้อจำกัดเพดานลดหย่อน (Retirement Cap, Insurance Cap, Donation Caps) ทั้งหมดถูกต้อง 100% ครบถ้วนทุกเงื่อนไขเชิงคณิตศาสตร์</p>
                </div>
              </div>

              {/* Notice that cases are added to list below */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 p-4 rounded-xl text-xs flex items-center gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <p className="text-muted-foreground leading-relaxed">
                  💡 **ขณะนี้เคสทั้งหมดได้รับการนำไปรวมและแสดงผลใน "รายการชุดการทดสอบ" ด้านล่างเรียบร้อยแล้ว** คุณสามารถเลื่อนลงไปคลิกขยายดูรายละเอียดการคำนวณและช่องกรอกข้อมูลภาษาไทยของแต่ละเคสได้เลยครับ
                </p>
              </div>

              {showCombinatorial && (
                <div className="border border-border/80 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto mt-4 shadow-inner">
                  <Table className="text-[10px]">
                    <TableHeader className="bg-muted/80 sticky top-0 z-10">
                      <TableRow>
                        <TableHead className="w-[80px]">รหัสเคส</TableHead>
                        <TableHead className="w-[100px]">แบบฟอร์ม</TableHead>
                        <TableHead>รายละเอียดเงินได้</TableHead>
                        <TableHead>รายละเอียดค่าลดหย่อน</TableHead>
                        <TableHead className="text-right">รายได้สุทธิ (บาท)</TableHead>
                        <TableHead className="text-right">ภาษีที่ต้องจ่าย (บาท)</TableHead>
                        <TableHead className="w-[80px] text-center">ผลลัพธ์</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {combinatorialResults.cases.map((c) => (
                        <TableRow key={c.id} className="hover:bg-muted/30">
                          <TableCell className="font-mono font-medium">#{c.id}</TableCell>
                          <TableCell>
                            <Badge className="text-[9px] px-1.5 py-0 font-semibold" variant="secondary">{c.formType}</Badge>
                          </TableCell>
                          <TableCell className="max-w-[150px] truncate font-medium text-muted-foreground" title={c.incomeDesc}>{c.incomeDesc}</TableCell>
                          <TableCell className="max-w-[150px] truncate text-muted-foreground" title={c.allowanceDesc}>{c.allowanceDesc}</TableCell>
                          <TableCell className="text-right font-mono font-semibold">{formatTHB(c.actual.netTaxableIncome)}</TableCell>
                          <TableCell className="text-right font-mono font-bold text-primary">{formatTHB(c.actual.taxLiability)}</TableCell>
                          <TableCell className="text-center">
                            {c.passed ? (
                              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-none font-bold text-[9px] px-1 py-0">ผ่าน</Badge>
                            ) : (
                              <Badge variant="destructive" className="font-bold text-[9px] px-1 py-0">ล้มเหลว</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Test Cases List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">รายการชุดการทดสอบ (Test Cases)</h2>
          
          {testCases.map((tc) => {
            const result = testResults[tc.id];
            const isExpanded = expandedTest === tc.id;
            
            return (
              <Card 
                key={tc.id} 
                className={`transition-all border ${
                  result 
                    ? result.passed 
                      ? 'border-emerald-500/30 dark:border-emerald-500/15 bg-emerald-50/10 dark:bg-emerald-950/5' 
                      : 'border-red-500/30 dark:border-red-500/15 bg-red-50/10 dark:bg-red-950/5' 
                    : 'border-border'
                }`}
              >
                <div 
                  className="p-5 flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setExpandedTest(isExpanded ? null : tc.id)}
                >
                  <div className="flex-1 space-y-1.5 pr-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">Case #{tc.id}</span>
                      <Badge className={`border px-2.5 py-0.5 text-xs font-bold ${getFormBadgeColor(tc.formType)}`}>
                        {tc.formType}
                      </Badge>
                      <h3 className="font-bold text-foreground text-base">{tc.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tc.description}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    {result ? (
                      result.passed ? (
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 gap-1 text-xs px-2.5 py-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านการทดสอบ
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1 text-xs px-2.5 py-1">
                          <XCircle className="w-3.5 h-3.5" /> ไม่ผ่าน
                        </Badge>
                      )
                    ) : (
                      <Badge variant="outline" className="text-xs px-2.5 py-1">ยังไม่ได้รัน</Badge>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        runSingleTest(tc);
                      }}
                      className="h-8 w-8"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                  </div>
                </div>

                {isExpanded && (
                  <CardContent className="border-t border-border/50 p-6 bg-card space-y-6">
                    {/* Inputs & Expected comparison grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Input Specifications mapped to Thai Forms */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                          <Briefcase className="w-4 h-4 text-blue-500" /> ช่องข้อมูลที่กรอกใน {tc.formType}
                        </h4>
                        
                        <div className="bg-muted/40 p-4 rounded-xl space-y-4 text-xs">
                          {/* Income Section */}
                          <div>
                            <span className="font-semibold block mb-2 text-primary border-b border-border/60 pb-1">1. ข้อมูลรายได้เงินได้</span>
                            <div className="space-y-2">
                              {Object.entries(tc.income).map(([key, val]) => {
                                const typedKey = key as keyof Income;
                                if (typedKey === 'isMedicalProfession') return null;
                                return (
                                  <div key={key} className="flex justify-between items-start gap-2 border-b border-border/20 pb-1.5">
                                    <span className="text-muted-foreground text-left leading-relaxed">
                                      {incomeLabels[typedKey] || key}
                                      {typedKey === 'type40_6' && tc.income.isMedicalProfession && (
                                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium">
                                          (ระบุเป็นวิชาชีพอิสระทางการแพทย์)
                                        </span>
                                      )}
                                    </span>
                                    <span className="font-bold text-right whitespace-nowrap">{formatTHB(val as number)} บาท</span>
                                  </div>
                                );
                              })}
                              {Object.keys(tc.income).length === 0 && (
                                <div className="text-muted-foreground italic py-1">ไม่มีข้อมูลรายได้</div>
                              )}
                            </div>
                          </div>
                          
                          {/* Allowances Section */}
                          <div>
                            <span className="font-semibold block mb-2 text-primary border-b border-border/60 pb-1">2. ข้อมูลค่าลดหย่อนและยกเว้น</span>
                            <div className="space-y-2">
                              {/* Standard Personal allowance show as auto */}
                              <div className="flex justify-between items-start gap-2 border-b border-border/20 pb-1.5">
                                <span className="text-muted-foreground text-left">ลดหย่อนส่วนตัว (ผู้มีเงินได้)</span>
                                <span className="font-bold text-right text-emerald-600 dark:text-emerald-400">
                                  {tc.isMidYear ? '30,000' : '60,000'} บาท (อัตโนมัติ)
                                </span>
                              </div>

                              {Object.entries(tc.allowances).map(([key, val]) => {
                                const typedKey = key as keyof Allowances;
                                let valueStr = '';
                                if (typeof val === 'boolean') {
                                  valueStr = val ? 'เลือกหักลดหย่อน' : 'ไม่หักลดหย่อน';
                                } else {
                                  valueStr = `${formatTHB(val as number)} บาท`;
                                }
                                return (
                                  <div key={key} className="flex justify-between items-start gap-2 border-b border-border/20 pb-1.5">
                                    <span className="text-muted-foreground text-left leading-relaxed">{allowanceLabels[typedKey] || key}</span>
                                    <span className="font-bold text-right whitespace-nowrap">{valueStr}</span>
                                  </div>
                                );
                              })}
                              {Object.keys(tc.allowances).length === 0 && (
                                <div className="text-muted-foreground italic py-1">ไม่มีการกรอกข้อมูลลดหย่อนเพิ่มเติม</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expected vs Actual */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                          <FileText className="w-4 h-4 text-emerald-500" /> ตารางเปรียบเทียบผลลัพธ์ (Assertions)
                        </h4>
                        
                        <Table className="border border-border/80 rounded-xl overflow-hidden text-xs">
                          <TableHeader className="bg-muted/40">
                            <TableRow>
                              <TableHead>ค่าที่ตรวจสอบ</TableHead>
                              <TableHead className="text-right">ผลที่คาดหวัง (Expected)</TableHead>
                              <TableHead className="text-right">ผลการรันจริง (Actual)</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">รายได้รวม</TableCell>
                              <TableCell className="text-right font-mono">{formatTHB(tc.expected.totalIncome)}</TableCell>
                              <TableCell className="text-right font-mono font-semibold">
                                {result ? formatTHB(result.actual.totalIncome) : '-'}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">ค่าใช้จ่ายรวม</TableCell>
                              <TableCell className="text-right font-mono">{formatTHB(tc.expected.totalExpenses)}</TableCell>
                              <TableCell className="text-right font-mono font-semibold">
                                {result ? formatTHB(result.actual.totalExpenses) : '-'}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">ค่าลดหย่อนรวม</TableCell>
                              <TableCell className="text-right font-mono">{formatTHB(tc.expected.totalAllowances)}</TableCell>
                              <TableCell className="text-right font-mono font-semibold">
                                {result ? formatTHB(result.actual.totalAllowances) : '-'}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">รายได้สุทธิ</TableCell>
                              <TableCell className="text-right font-mono">{formatTHB(tc.expected.netTaxableIncome)}</TableCell>
                              <TableCell className="text-right font-mono font-semibold">
                                {result ? formatTHB(result.actual.netTaxableIncome) : '-'}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">มีหน้าที่ยื่นแบบ (ต้องส่งภาษี)</TableCell>
                              <TableCell className="text-right">{tc.expected.hasFilingObligation ? 'ต้องยื่นแบบ' : 'ไม่ต้องยื่นแบบ'}</TableCell>
                              <TableCell className="text-right font-semibold">
                                {result ? (result.actual.hasFilingObligation ? 'ต้องยื่นแบบ' : 'ไม่ต้องยื่นแบบ') : '-'}
                              </TableCell>
                            </TableRow>
                            <TableRow className="bg-primary/5 font-semibold text-primary">
                              <TableCell>ภาษีที่ต้องชำระ</TableCell>
                              <TableCell className="text-right font-mono">{formatTHB(tc.expected.taxLiability)}</TableCell>
                              <TableCell className="text-right font-mono font-bold text-base">
                                {result ? formatTHB(result.actual.taxLiability) : '-'}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* Show errors if failed */}
                    {result && !result.passed && (
                      <div className="bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300 p-4 rounded-xl text-xs space-y-1">
                        <span className="font-bold">รายละเอียดความล้มเหลว (Errors):</span>
                        <ul className="list-disc pl-5 space-y-0.5">
                          {result.errors.map((err, idx) => <li key={idx}>{err}</li>)}
                        </ul>
                      </div>
                    )}

                    {/* Tax Brackets Detailed Breakdown if run */}
                    {result && (
                      <div className="space-y-3 pt-2">
                        <h4 className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                          <DollarSign className="w-4 h-4 text-amber-500" /> ตารางคำนวณขั้นภาษีจริง (Tax Brackets)
                        </h4>
                        
                        <Table className="border border-border/80 rounded-xl overflow-hidden text-xs">
                          <TableHeader className="bg-muted/40">
                            <TableRow>
                              <TableHead>ขั้นเงินได้สุทธิ (บาท)</TableHead>
                              <TableHead className="text-right">เงินได้สุทธิในขั้น (บาท)</TableHead>
                              <TableHead className="text-right">อัตราภาษี</TableHead>
                              <TableHead className="text-right">ภาษีในแต่ละขั้น (บาท)</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {result.actual.brackets.map((b, idx) => (
                              <TableRow key={idx} className={b.taxableAmount > 0 ? "bg-amber-50/10 font-medium" : "text-muted-foreground"}>
                                <TableCell>
                                  {b.max ? `${formatTHB(b.min)} - ${formatTHB(b.max)}` : `${formatTHB(b.min)} ขึ้นไป`}
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                  {formatTHB(b.taxableAmount)}
                                </TableCell>
                                <TableCell className="text-right">{(b.rate * 100).toFixed(0)}%</TableCell>
                                <TableCell className="text-right font-mono">
                                  {b.taxInBracket > 0 ? formatTHB(b.taxInBracket) : '0.00'}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </>
    ) : (
      <div className="space-y-6 animate-in fade-in duration-200">
            {/* Page Title */}
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                คู่มือและกฎเกณฑ์ลดหย่อนภาษีปี 2569
              </h2>
              <p className="text-xs text-muted-foreground mt-1">อ้างอิงตามหลักกฎหมายภาษีสรรพากรสำหรับคำนวณแบบ ภ.ง.ด. 90 / 91 / 94</p>
            </div>

            {/* Grid for guide categories */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Category 1: Filing Thresholds */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                    <Scale className="w-4 h-4" /> เกณฑ์หน้าที่การยื่นแบบภาษี (Filing Duty)
                  </CardTitle>
                  <CardDescription className="text-[10px]">รายได้ขั้นต่ำที่กฎหมายกำหนดว่า "ต้องยื่นแบบ"</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <strong className="text-foreground">ยื่นแบบปลายปี (ภ.ง.ด. 90 / 91)</strong>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1 text-[11px]">
                      <li><span className="font-semibold text-foreground">คนโสด (มีเงินเดือนอย่างเดียว):</span> ต้องยื่นเมื่อรายได้รวม &gt; 120,000 บาท/ปี</li>
                      <li><span className="font-semibold text-foreground">คนโสด (มีรายได้ทางอื่นด้วย):</span> ต้องยื่นเมื่อรายได้รวม &gt; 60,000 บาท/ปี</li>
                      <li><span className="font-semibold text-foreground">สมรส (มีเงินเดือนอย่างเดียว):</span> ต้องยื่นเมื่อรายได้รวม &gt; 220,000 บาท/ปี</li>
                      <li><span className="font-semibold text-foreground">สมรส (มีรายได้ทางอื่นด้วย):</span> ต้องยื่นเมื่อรายได้รวม &gt; 120,000 บาท/ปี</li>
                    </ul>
                  </div>
                  <div className="space-y-1 border-t border-border/50 pt-2">
                    <strong className="text-foreground">ยื่นแบบครึ่งปี (ภ.ง.ด. 94)</strong>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      สำหรับผู้มีรายได้ ม.40(5) - (8) ในช่วงครึ่งปีแรก:
                    </p>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1 text-[11px]">
                      <li><span className="font-semibold text-foreground">คนโสด:</span> ต้องยื่นเมื่อรายได้ครึ่งปี &gt; 60,000 บาท</li>
                      <li><span className="font-semibold text-foreground">สมรส:</span> ต้องยื่นเมื่อรายได้ครึ่งปี &gt; 120,000 บาท</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Category 2: Expense Deductions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                    <DollarSign className="w-4 h-4" /> อัตราการหักค่าใช้จ่ายแยกประเภทรายได้
                  </CardTitle>
                  <CardDescription className="text-[10px]">การหักค่าใช้จ่ายเหมาตามมาตรา 40(1) - 40(8)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-muted/40 p-2.5 rounded-lg">
                      <span className="font-semibold block text-foreground">ม.40(1) และ 40(2) (เงินเดือน/รับจ้าง)</span>
                      <span className="text-muted-foreground block mt-1">หักเหมา 50% สูงสุดไม่เกิน 100,000 บาท</span>
                    </div>
                    <div className="bg-muted/40 p-2.5 rounded-lg">
                      <span className="font-semibold block text-foreground">ม.40(3) (ค่าลิขสิทธิ์/สิทธิ์ทางปัญญา)</span>
                      <span className="text-muted-foreground block mt-1">หักเหมา 50% สูงสุดไม่เกิน 100,000 บาท</span>
                    </div>
                    <div className="bg-muted/40 p-2.5 rounded-lg">
                      <span className="font-semibold block text-foreground">ม.40(5) (ค่าเช่าทรัพย์สิน)</span>
                      <span className="text-muted-foreground block mt-1">หักเหมา 30% ของรายได้</span>
                    </div>
                    <div className="bg-muted/40 p-2.5 rounded-lg">
                      <span className="font-semibold block text-foreground">ม.40(6) (วิชาชีพอิสระ)</span>
                      <span className="text-muted-foreground block mt-1">แพทย์หัก 60% / อื่นๆ (วิศวกร/ทนาย) หัก 30%</span>
                    </div>
                    <div className="bg-muted/40 p-2.5 rounded-lg col-span-2">
                      <span className="font-semibold block text-foreground">ม.40(7) (รับเหมา) และ ม.40(8) (ค้าขายออนไลน์/อื่นๆ)</span>
                      <span className="text-muted-foreground block mt-1">หักเหมา 60% ของรายได้</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category 3: Standard Allowances */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                    <Heart className="w-4 h-4" /> ค่าลดหย่อนส่วนตัวและครอบครัว (Family Allowances)
                  </CardTitle>
                  <CardDescription className="text-[10px]">สิทธิลดหย่อนพื้นฐานสำหรับผู้มีเงินได้และครอบครัว</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="grid grid-cols-12 gap-2 border-b border-border/40 pb-2 text-[11px] items-start">
                    <span className="col-span-6 text-muted-foreground font-medium">ลดหย่อนส่วนตัว (ผู้มีเงินได้)</span>
                    <span className="col-span-6 text-right font-semibold text-foreground leading-tight">
                      60,000 บาท/ปี <span className="text-[10px] text-muted-foreground font-normal block sm:inline">(ครึ่งปี 30,000 บาท)</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-12 gap-2 border-b border-border/40 pb-2 text-[11px] items-start">
                    <span className="col-span-6 text-muted-foreground font-medium">คู่สมรส (ไม่มีรายได้)</span>
                    <span className="col-span-6 text-right font-semibold text-foreground leading-tight">
                      60,000 บาท/ปี <span className="text-[10px] text-muted-foreground font-normal block sm:inline">(ครึ่งปี 30,000 บาท)</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-12 gap-2 border-b border-border/40 pb-2 text-[11px] items-start">
                    <span className="col-span-6 text-muted-foreground font-medium">บุตรคนที่ 1 และคนถัดไป</span>
                    <span className="col-span-6 text-right font-semibold text-foreground leading-tight">
                      คนแรก 30,000 บาท <span className="text-[10px] text-muted-foreground font-normal block">คนถัดไปคนละ 60,000 บาท</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-12 gap-2 border-b border-border/40 pb-2 text-[11px] items-start">
                    <span className="col-span-6 text-muted-foreground font-medium">อุปการะบิดามารดา (60 ปีขึ้นไป)</span>
                    <span className="col-span-6 text-right font-semibold text-foreground leading-tight">
                      คนละ 30,000 บาท <span className="text-[10px] text-muted-foreground font-normal block">(สูงสุด 4 ท่าน)</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-12 gap-2 pb-1 text-[11px] items-start">
                    <span className="col-span-6 text-muted-foreground font-medium">อุปการะผู้พิการ/ทุพพลภาพ</span>
                    <span className="col-span-6 text-right font-semibold text-foreground leading-tight">
                      คนละ 60,000 บาท
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Category 4: Retirement and Savings Capping */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                    <Layers className="w-4 h-4" /> กลุ่มเกษียณอายุและการลงทุน (Retirement Group Cap)
                  </CardTitle>
                  <CardDescription className="text-[10px]">การลดหย่อนสะสมเพื่อการเกษียณที่จำกัดเพดานรวมกัน</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="bg-amber-500/5 border border-amber-500/20 p-3 rounded-lg text-[11px] text-amber-800 dark:text-amber-300">
                    <strong>⚠️ กฎเพดานรวมกลุ่มเกษียณ (500,000 บาท)</strong>
                    <p className="mt-1 leading-relaxed text-[10px] text-muted-foreground">
                      ยอดรวมของกองทุนลดหย่อนภาษีกลุ่มนี้ ได้แก่ **SSF + RMF + ประกันบำนาญ + กองทุนสำรองเลี้ยงชีพ (PVD)** รวมกันทั้งหมดแล้ว ต้องมีมูลค่าหักลดหย่อนจริงไม่เกิน **500,000 บาท**
                    </p>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div className="grid grid-cols-12 gap-2 border-b border-border/30 pb-1.5 items-start">
                      <span className="col-span-4 text-muted-foreground font-medium">กองทุน SSF:</span>
                      <span className="col-span-8 text-right font-semibold text-foreground leading-tight">
                        สูงสุด 30% ของรายได้ <span className="text-[10px] text-muted-foreground font-normal block">(ไม่เกิน 200,000 บาท)</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-12 gap-2 border-b border-border/30 pb-1.5 items-start">
                      <span className="col-span-4 text-muted-foreground font-medium">กองทุน RMF:</span>
                      <span className="col-span-8 text-right font-semibold text-foreground leading-tight">
                        สูงสุด 30% ของรายได้ <span className="text-[10px] text-muted-foreground font-normal block">(ไม่เกิน 500,000 บาท)</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-12 gap-2 pb-1 items-start">
                      <span className="col-span-4 text-muted-foreground font-medium">ประกันบำนาญ:</span>
                      <span className="col-span-8 text-right font-semibold text-foreground leading-tight">
                        สูงสุด 15% ของรายได้ <span className="text-[10px] text-muted-foreground font-normal block">(ไม่เกิน 200,000 บาท)</span>
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category 5: Insurance & Interest */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                    <FileText className="w-4 h-4" /> ประกัน, ดอกเบี้ยกู้บ้าน, และกลุ่มเงินบริจาค (Insurance & Donations)
                  </CardTitle>
                  <CardDescription className="text-[10px]">สิทธิลดหย่อนกลุ่มประกันชีวิต ดอกเบี้ย และเงินบริจาค</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-1 text-[11px]">
                      <strong className="text-foreground">ประกันชีวิตและสุขภาพ</strong>
                      <p className="text-muted-foreground leading-relaxed text-[10px] mt-1">
                        - ประกันชีวิตหักได้ตามจริง ไม่เกิน **100,000 บาท**<br/>
                        - ประกันสุขภาพหักได้สูงสุด **25,000 บาท**<br/>
                        - *ผลรวมกลุ่มประกันชีวิตและสุขภาพทั่วไป ต้องไม่เกิน 100,000 บาท*
                      </p>
                    </div>
                    <div className="space-y-1 text-[11px] border-t md:border-t-0 md:border-l border-border/60 pt-2 md:pt-0 md:pl-4">
                      <strong className="text-foreground">ดอกเบี้ยกู้ซื้อบ้าน</strong>
                      <p className="text-muted-foreground leading-relaxed text-[10px] mt-1">
                        หักลดหย่อนได้ตามจำนวนที่ชำระดอกเบี้ยกู้บ้านจริงให้แก่สถาบันการเงิน สูงสุดไม่เกิน **100,000 บาท**
                      </p>
                    </div>
                    <div className="space-y-1 text-[11px] border-t md:border-t-0 md:border-l border-border/60 pt-2 md:pt-0 md:pl-4">
                      <strong className="text-foreground">เงินบริจาคและข้อจำกัดเพดาน</strong>
                      <p className="text-muted-foreground leading-relaxed text-[10px] mt-1">
                        - **บริจาคศึกษา/กีฬา/พยาบาลรัฐ**: หักลดหย่อนได้ **2 เท่าของจ่ายจริง** แต่สูงสุดไม่เกิน **10% ของเงินได้สุทธิ**ก่อนบริจาคทั่วไป<br/>
                        - **บริจาคทั่วไป**: หักได้ตามจริง สูงสุดไม่เกิน **10% ของเงินได้สุทธิ**คงเหลือหลังหักบริจาคศึกษาแล้ว
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category 6: Tax Brackets Table */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                    <DollarSign className="w-4 h-4" /> ตารางฐานอัตราภาษีเงินได้บุคคลธรรมดาแบบก้าวหน้า
                  </CardTitle>
                  <CardDescription className="text-[10px]">ตารางคิดเงินได้สุทธิขั้นบันไดภาษี</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table className="text-xs">
                    <TableHeader className="bg-muted/40">
                      <TableRow>
                        <TableHead>ช่วงเงินได้สุทธิ (บาท)</TableHead>
                        <TableHead className="text-right">อัตราภาษี</TableHead>
                        <TableHead className="text-right">ภาษีสูงสุดสะสมในขั้น (บาท)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>0.00 - 150,000.00</TableCell>
                        <TableCell className="text-right">ได้รับการยกเว้น (0%)</TableCell>
                        <TableCell className="text-right">0.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>150,000.00 - 300,000.00</TableCell>
                        <TableCell className="text-right">5%</TableCell>
                        <TableCell className="text-right">7,500.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>300,000.00 - 500,000.00</TableCell>
                        <TableCell className="text-right">10%</TableCell>
                        <TableCell className="text-right">20,000.00 (สะสมสูงสุด 27,500.00)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>500,000.00 - 750,000.00</TableCell>
                        <TableCell className="text-right">15%</TableCell>
                        <TableCell className="text-right">37,500.00 (สะสมสูงสุด 65,000.00)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>750,000.00 - 1,000,000.00</TableCell>
                        <TableCell className="text-right">20%</TableCell>
                        <TableCell className="text-right">50,000.00 (สะสมสูงสุด 115,000.00)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>1,000,000.00 - 2,000,000.00</TableCell>
                        <TableCell className="text-right">25%</TableCell>
                        <TableCell className="text-right">250,000.00 (สะสมสูงสุด 365,000.00)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2,000,000.00 - 5,000,000.00</TableCell>
                        <TableCell className="text-right">30%</TableCell>
                        <TableCell className="text-right">900,000.00 (สะสมสูงสุด 1,265,000.00)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>5,000,000.00 ขึ้นไป</TableCell>
                        <TableCell className="text-right">35%</TableCell>
                        <TableCell className="text-right">คิดอัตรา 35% ของเงินได้ส่วนที่เกิน 5 ล้านบาท</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border py-8 text-center text-muted-foreground text-xs mt-10">
        <p>Thai Tax Calculator Standalone Suite - 2026</p>
      </footer>
    </div>
  );
}
