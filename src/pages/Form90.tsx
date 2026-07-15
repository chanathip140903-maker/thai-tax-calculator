import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, TaxFormValues } from '../lib/schema';
import { calculateTax } from '../lib/taxCalculation';
import { TaxSummary } from '../components/TaxSummary';
import { NumberInput, FormSection, SwitchToggle } from '../components/FormElements';
import { Briefcase, Heart, PiggyBank, Home, User, ArrowLeft, Layers, Percent } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { ThemeToggle } from '../components/ThemeToggle';

export function Form90() {
  const [location] = useLocation();
  const form = useForm<TaxFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: {
        type40_1: 0,
        type40_2: 0,
        type40_3: 0,
        type40_4a: 0,
        type40_4b: 0,
        type40_5: 0,
        type40_6: 0,
        isMedicalProfession: false,
        type40_7: 0,
        type40_8: 0,
        withholdingTax: 0,
      },
      allowances: {
        spouse: false,
        children_1: 0,
        children_2_plus: 0,
        parents: 0,
        disabled: 0,
        lifeInsurance: 0,
        healthInsurance: 0,
        parentsHealthInsurance: 0,
        pensionInsurance: 0,
        providentFund: 0,
        ssf: 0,
        rmf: 0,
        homeLoanInterest: 0,
        socialSecurity: 0,
        educationDonation: 0,
        generalDonation: 0,
      }
    }
  });

  const values = form.watch();
  const [showIncome, setShowIncome] = React.useState({
    t1_2: true,
    t3: false,
    t4: false,
    t5: false,
    t6: false,
    t7_8: false,
  });

  const result = React.useMemo(() => {
    return calculateTax(values.income, values.allowances, false);
  }, [values]);

  const toggleSection = (key: keyof typeof showIncome) => {
    setShowIncome(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border py-4 px-6 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer select-none">
            <div className="bg-primary p-2.5 rounded-xl text-primary-foreground shadow-md transition-all group-hover:scale-105 group-hover:shadow-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground leading-none group-hover:text-primary transition-colors">ThaiTax</h1>
              <p className="text-xs text-muted-foreground mt-1 font-medium">โปรแกรมวางแผนและคำนวณภาษีเงินได้บุคคลธรรมดา</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-4 sm:gap-6">
              <Link href="/91" className={`text-sm transition-all cursor-pointer font-semibold ${location === '/91' ? 'text-primary border-b-2 border-primary pb-0.5' : 'text-muted-foreground hover:text-foreground font-medium'}`}>
                ภ.ง.ด. 91
              </Link>
              <Link href="/90" className={`text-sm transition-all cursor-pointer font-semibold ${location === '/90' ? 'text-primary border-b-2 border-primary pb-0.5' : 'text-muted-foreground hover:text-foreground font-medium'}`}>
                ภ.ง.ด. 90
              </Link>
              <Link href="/94" className={`text-sm transition-all cursor-pointer font-semibold ${location === '/94' ? 'text-primary border-b-2 border-primary pb-0.5' : 'text-muted-foreground hover:text-foreground font-medium'}`}>
                ภ.ง.ด. 94
              </Link>
            </nav>
            <div className="border-l border-border pl-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 pt-8 pb-4">
        <div className="border-b border-border/65 pb-5">
          <Link href="/" className="inline-flex items-center text-xs text-muted-foreground hover:text-primary mb-3 transition-colors font-medium">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            กลับหน้าหลัก
          </Link>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">คำนวณภาษี ภ.ง.ด. 90</h2>
          <p className="text-sm text-muted-foreground mt-1">สำหรับผู้มีรายได้หลากหลายประเภท (มาตรา 40(1) ถึง 40(8))</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Col - Forms */}
        <div className="lg:col-span-8 space-y-8">

          <div className="bg-card p-8 rounded-2xl shadow-sm border border-border space-y-10">
            <div className="border-b border-border pb-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Layers className="w-6 h-6 text-primary" />
                เลือกประเภทรายได้ของคุณ
              </h2>
              <p className="text-muted-foreground mt-2">คลิกเพื่อเปิดกรอกข้อมูลรายได้ในหมวดหมู่ที่คุณมี</p>

              <div className="flex flex-wrap gap-3 mt-6">
                <button onClick={() => toggleSection('t1_2')} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer ${showIncome.t1_2 ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700'}`}>
                  40(1),(2) เงินเดือน/รับจ้าง
                </button>
                <button onClick={() => toggleSection('t3')} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer ${showIncome.t3 ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700'}`}>
                  40(3) ลิขสิทธิ์
                </button>
                <button onClick={() => toggleSection('t4')} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer ${showIncome.t4 ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700'}`}>
                  40(4) ดอกเบี้ย/ปันผล
                </button>
                <button onClick={() => toggleSection('t5')} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer ${showIncome.t5 ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700'}`}>
                  40(5) ค่าเช่า
                </button>
                <button onClick={() => toggleSection('t6')} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer ${showIncome.t6 ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700'}`}>
                  40(6) วิชาชีพอิสระ
                </button>
                <button onClick={() => toggleSection('t7_8')} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer ${showIncome.t7_8 ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700'}`}>
                  40(7),(8) รับเหมา/อื่นๆ
                </button>
              </div>
            </div>

            {showIncome.t1_2 && (
              <FormSection title="เงินเดือนและรับจ้างทั่วไป (มาตรา 40(1), 40(2))" description="หักค่าใช้จ่ายได้ 50% รวมกันไม่เกิน 100,000 บาท" icon={Briefcase}>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Controller control={form.control} name="income.type40_1" render={({ field }) => (
                    <NumberInput label="มาตรา 40(1) เงินเดือน โบนัส" value={field.value} onChangeValue={field.onChange} />
                  )} />
                  <Controller control={form.control} name="income.type40_2" render={({ field }) => (
                    <NumberInput label="มาตรา 40(2) รับจ้างทั่วไป ค่านายหน้า" value={field.value} onChangeValue={field.onChange} />
                  )} />
                </div>
              </FormSection>
            )}

            {showIncome.t3 && (
              <FormSection title="ค่าลิขสิทธิ์ (มาตรา 40(3))" description="หักค่าใช้จ่ายได้ 50% ไม่เกิน 100,000 บาท">
                <Controller control={form.control} name="income.type40_3" render={({ field }) => (
                  <NumberInput label="ค่าลิขสิทธิ์" value={field.value} onChangeValue={field.onChange} />
                )} />
              </FormSection>
            )}

            {showIncome.t4 && (
              <FormSection title="ดอกเบี้ยและเงินปันผล (มาตรา 40(4))" description="ไม่สามารถหักค่าใช้จ่ายได้ (สามารถเลือกไม่นำมารวมคำนวณได้หากถูกหัก ณ ที่จ่ายไปแล้ว Final Tax)">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Controller control={form.control} name="income.type40_4a" render={({ field }) => (
                    <NumberInput label="ดอกเบี้ยเงินฝาก พันธบัตร" value={field.value} onChangeValue={field.onChange} />
                  )} />
                  <Controller control={form.control} name="income.type40_4b" render={({ field }) => (
                    <NumberInput label="เงินปันผล" helperText="คำนวณแบบไม่เครดิตภาษี" value={field.value} onChangeValue={field.onChange} />
                  )} />
                </div>
              </FormSection>
            )}

            {showIncome.t5 && (
              <FormSection title="ค่าเช่าทรัพย์สิน (มาตรา 40(5))" description="ระบบจะหักค่าใช้จ่ายเหมา 30% ให้เป็นค่าเริ่มต้น (สำหรับบ้าน/โรงเรือน)">
                <Controller control={form.control} name="income.type40_5" render={({ field }) => (
                  <NumberInput label="ค่าเช่ารวมทั้งปี" value={field.value} onChangeValue={field.onChange} />
                )} />
              </FormSection>
            )}

            {showIncome.t6 && (
              <FormSection title="วิชาชีพอิสระ (มาตรา 40(6))" description="แพทย์หักเหมา 60% วิชาชีพอื่นหักเหมา 30%">
                <div className="space-y-6">
                  <Controller control={form.control} name="income.isMedicalProfession" render={({ field }) => (
                    <SwitchToggle label="เป็นรายได้จากการประกอบโรคศิลปะ (แพทย์)" helperText="เพื่อสิทธิหักค่าใช้จ่าย 60%" checked={field.value} onChangeChecked={field.onChange} />
                  )} />
                  <Controller control={form.control} name="income.type40_6" render={({ field }) => (
                    <NumberInput label="รายได้วิชาชีพอิสระ" value={field.value} onChangeValue={field.onChange} />
                  )} />
                </div>
              </FormSection>
            )}

            {showIncome.t7_8 && (
              <FormSection title="รับเหมาและธุรกิจอื่นๆ (มาตรา 40(7), 40(8))" description="รับเหมาหักเหมา 70%, ธุรกิจอื่นๆ หักเหมา 60%">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Controller control={form.control} name="income.type40_7" render={({ field }) => (
                    <NumberInput label="มาตรา 40(7) รับเหมาก่อสร้าง" value={field.value} onChangeValue={field.onChange} />
                  )} />
                  <Controller control={form.control} name="income.type40_8" render={({ field }) => (
                    <NumberInput label="มาตรา 40(8) รายได้อื่นๆ ค้าขาย" value={field.value} onChangeValue={field.onChange} />
                  )} />
                </div>
              </FormSection>
            )}

            <FormSection title="ภาษีหัก ณ ที่จ่ายรวม" icon={Percent}>
              <Controller
                control={form.control}
                name="income.withholdingTax"
                render={({ field }) => (
                  <NumberInput
                    label="รวมภาษีหัก ณ ที่จ่ายทุกประเภทรายได้"
                    helperText="นำยอดรวมทั้งหมดมากรอกที่นี่"
                    value={field.value}
                    onChangeValue={field.onChange}
                  />
                )}
              />
            </FormSection>
          </div>

          {/* Deductions section (Same as 91 mostly, reuse structure) */}
          <div className="bg-card p-8 rounded-2xl shadow-sm border border-border space-y-10">
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-6">ข้อมูลค่าลดหย่อน</h2>

            <FormSection title="ค่าลดหย่อนครอบครัว" icon={User}>
              <div className="space-y-6">
                <Controller control={form.control} name="allowances.spouse" render={({ field }) => (
                  <SwitchToggle label="คู่สมรสไม่มีเงินได้" checked={field.value} onChangeChecked={field.onChange} />
                )} />
                <div className="grid gap-6 sm:grid-cols-2">
                  <Controller control={form.control} name="allowances.children_1" render={({ field }) => (
                    <NumberInput label="บุตร (คนแรก/ก่อนปี 61)" value={field.value} onChangeValue={field.onChange} suffix="คน" />
                  )} />
                  <Controller control={form.control} name="allowances.children_2_plus" render={({ field }) => (
                    <NumberInput label="บุตร (คนที่ 2 ขึ้นไป)" value={field.value} onChangeValue={field.onChange} suffix="คน" />
                  )} />
                  <Controller control={form.control} name="allowances.parents" render={({ field }) => (
                    <NumberInput label="อุปการะบิดามารดา" value={field.value} onChangeValue={field.onChange} suffix="คน" />
                  )} />
                </div>
              </div>
            </FormSection>

            <FormSection title="ประกันและการลงทุน" icon={PiggyBank}>
              <div className="grid gap-6 sm:grid-cols-2">
                <Controller control={form.control} name="allowances.socialSecurity" render={({ field }) => (
                  <NumberInput label="ประกันสังคม" value={field.value} onChangeValue={field.onChange} />
                )} />
                <Controller control={form.control} name="allowances.lifeInsurance" render={({ field }) => (
                  <NumberInput label="เบี้ยประกันชีวิต" value={field.value} onChangeValue={field.onChange} />
                )} />
                <Controller control={form.control} name="allowances.healthInsurance" render={({ field }) => (
                  <NumberInput label="เบี้ยประกันสุขภาพ" value={field.value} onChangeValue={field.onChange} />
                )} />
                <Controller control={form.control} name="allowances.ssf" render={({ field }) => (
                  <NumberInput label="กองทุนรวม SSF" value={field.value} onChangeValue={field.onChange} />
                )} />
                <Controller control={form.control} name="allowances.rmf" render={({ field }) => (
                  <NumberInput label="กองทุนรวม RMF" value={field.value} onChangeValue={field.onChange} />
                )} />
                <Controller control={form.control} name="allowances.providentFund" render={({ field }) => (
                  <NumberInput label="กองทุนสำรองเลี้ยงชีพ" value={field.value} onChangeValue={field.onChange} />
                )} />
              </div>
            </FormSection>

            <FormSection title="อื่นๆ" icon={Home}>
              <div className="grid gap-6 sm:grid-cols-2">
                <Controller control={form.control} name="allowances.homeLoanInterest" render={({ field }) => (
                  <NumberInput label="ดอกเบี้ยบ้าน" value={field.value} onChangeValue={field.onChange} />
                )} />
                <Controller control={form.control} name="allowances.educationDonation" render={({ field }) => (
                  <NumberInput label="เงินบริจาคเพื่อการศึกษา (2เท่า)" value={field.value} onChangeValue={field.onChange} />
                )} />
                <Controller control={form.control} name="allowances.generalDonation" render={({ field }) => (
                  <NumberInput label="เงินบริจาคทั่วไป" value={field.value} onChangeValue={field.onChange} />
                )} />
              </div>
            </FormSection>
          </div>

        </div>

        {/* Right Col - Sticky Summary */}
        <div className="lg:col-span-4 relative">
          <TaxSummary result={result} withholdingTax={values.income.withholdingTax} />
        </div>
      </div>
    </div>
  );
}
