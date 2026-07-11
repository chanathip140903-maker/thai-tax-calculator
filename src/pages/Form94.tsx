import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, TaxFormValues } from '../lib/schema';
import { calculateTax } from '../lib/taxCalculation';
import { TaxSummary } from '../components/TaxSummary';
import { NumberInput, FormSection, SwitchToggle } from '../components/FormElements';
import { Heart, PiggyBank, Home, User, ArrowLeft, Clock, AlertTriangle } from 'lucide-react';
import { Link } from 'wouter';

export function Form94() {
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
  
  // Note: calculateTax is called with isMidYear = true to halve standard personal allowances
  const result = React.useMemo(() => {
    return calculateTax(values.income, values.allowances, true);
  }, [values]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary text-primary-foreground py-10 px-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Clock className="w-64 h-64" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <Link href="/" className="inline-flex items-center text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับหน้าแรก
          </Link>
          <div className="flex items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">คำนวณภาษีครึ่งปี ภ.ง.ด. 94</h1>
              <p className="text-primary-foreground/80 text-lg">สำหรับรายได้มาตรา 40(5) - 40(8) ที่เกิดขึ้นระหว่าง ม.ค. - มิ.ย.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Col - Forms */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-5 flex gap-4 text-amber-900 dark:text-amber-300 items-start">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-semibold">ข้อควรทราบสำหรับการยื่น ภ.ง.ด. 94</p>
              <ul className="list-disc list-inside space-y-0.5 ml-1">
                <li>กรอกเฉพาะรายได้ที่เกิดขึ้นในช่วง <strong>1 มกราคม - 30 มิถุนายน</strong> ของปีภาษี</li>
                <li>รายได้ 40(1) ถึง 40(4) ไม่ต้องนำมาคำนวณในแบบฟอร์มนี้</li>
                <li>ค่าลดหย่อนพื้นฐาน (เช่น ลดหย่อนส่วนตัว คู่สมรส บุตร บิดามารดา) ระบบจะหารครึ่งให้อัตโนมัติ</li>
                <li>กำหนดเวลายื่นแบบคือภายในเดือนกันยายนของทุกปี</li>
              </ul>
            </div>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-sm border border-border space-y-10">
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-6">รายได้ครึ่งปีแรก (ม.ค. - มิ.ย.)</h2>
            
            <FormSection title="ค่าเช่า (มาตรา 40(5))" description="หักค่าใช้จ่ายเหมา 30%">
              <Controller control={form.control} name="income.type40_5" render={({ field }) => (
                <NumberInput label="ค่าเช่ารวม 6 เดือนแรก" value={field.value} onChangeValue={field.onChange} />
              )}/>
            </FormSection>

            <FormSection title="วิชาชีพอิสระ (มาตรา 40(6))" description="แพทย์หักเหมา 60% วิชาชีพอื่นหักเหมา 30%">
              <div className="space-y-6">
                <Controller control={form.control} name="income.isMedicalProfession" render={({ field }) => (
                  <SwitchToggle label="เป็นรายได้จากการประกอบโรคศิลปะ (แพทย์)" checked={field.value} onChangeChecked={field.onChange} />
                )}/>
                <Controller control={form.control} name="income.type40_6" render={({ field }) => (
                  <NumberInput label="รายได้วิชาชีพอิสระ" value={field.value} onChangeValue={field.onChange} />
                )}/>
              </div>
            </FormSection>

            <FormSection title="รับเหมาและธุรกิจอื่นๆ (มาตรา 40(7), 40(8))" description="รับเหมาหักเหมา 70%, ธุรกิจอื่นๆ หักเหมา 60%">
              <div className="grid gap-6 sm:grid-cols-2">
                <Controller control={form.control} name="income.type40_7" render={({ field }) => (
                  <NumberInput label="รับเหมาก่อสร้าง" value={field.value} onChangeValue={field.onChange} />
                )}/>
                <Controller control={form.control} name="income.type40_8" render={({ field }) => (
                  <NumberInput label="รายได้อื่นๆ ค้าขายออนไลน์" value={field.value} onChangeValue={field.onChange} />
                )}/>
              </div>
            </FormSection>

            <FormSection title="ภาษีหัก ณ ที่จ่าย">
              <Controller control={form.control} name="income.withholdingTax" render={({ field }) => (
                <NumberInput label="ภาษีหัก ณ ที่จ่ายรวม (ม.ค. - มิ.ย.)" value={field.value} onChangeValue={field.onChange} />
              )}/>
            </FormSection>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-sm border border-border space-y-10">
            <h2 className="text-2xl font-bold text-foreground border-b border-border pb-6">ข้อมูลค่าลดหย่อน</h2>
            
            <FormSection title="ค่าลดหย่อนครอบครัว" icon={User} description="*ระบบจะคำนวณหักลดหย่อนให้ครึ่งหนึ่งของสิทธิเต็มปีอัตโนมัติ">
              <div className="space-y-6">
                <Controller control={form.control} name="allowances.spouse" render={({ field }) => (
                  <SwitchToggle label="คู่สมรสไม่มีเงินได้" checked={field.value} onChangeChecked={field.onChange} />
                )}/>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Controller control={form.control} name="allowances.children_1" render={({ field }) => (
                    <NumberInput label="บุตร (คนแรก/ก่อนปี 61)" value={field.value} onChangeValue={field.onChange} suffix="คน" />
                  )}/>
                  <Controller control={form.control} name="allowances.children_2_plus" render={({ field }) => (
                    <NumberInput label="บุตร (คนที่ 2 ขึ้นไป)" value={field.value} onChangeValue={field.onChange} suffix="คน" />
                  )}/>
                </div>
              </div>
            </FormSection>

            <FormSection title="ประกันและการลงทุนที่จ่ายไปแล้ว" icon={PiggyBank}>
              <div className="grid gap-6 sm:grid-cols-2">
                <Controller control={form.control} name="allowances.lifeInsurance" render={({ field }) => (
                  <NumberInput label="เบี้ยประกันชีวิต" value={field.value} onChangeValue={field.onChange} />
                )}/>
                <Controller control={form.control} name="allowances.ssf" render={({ field }) => (
                  <NumberInput label="กองทุนรวม SSF" value={field.value} onChangeValue={field.onChange} />
                )}/>
                <Controller control={form.control} name="allowances.rmf" render={({ field }) => (
                  <NumberInput label="กองทุนรวม RMF" value={field.value} onChangeValue={field.onChange} />
                )}/>
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
