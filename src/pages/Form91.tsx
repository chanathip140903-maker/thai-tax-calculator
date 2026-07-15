import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, TaxFormValues } from '../lib/schema';
import { calculateTax } from '../lib/taxCalculation';
import { TaxSummary } from '../components/TaxSummary';
import { NumberInput, FormSection, SwitchToggle } from '../components/FormElements';
import { Briefcase, Heart, PiggyBank, Home, User, ArrowLeft, FileText } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { ThemeToggle } from '../components/ThemeToggle';

export function Form91() {
  const [location] = useLocation();
  const form = useForm<TaxFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: {
        type40_1: 0,
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

  const result = React.useMemo(() => {
    return calculateTax(values.income, values.allowances, false);
  }, [values]);

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
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">คำนวณภาษี ภ.ง.ด. 91</h2>
          <p className="text-sm text-muted-foreground mt-1">สำหรับผู้มีรายได้จากเงินเดือนประจำเพียงอย่างเดียว (มาตรา 40(1))</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Col - Forms */}
        <div className="lg:col-span-8 space-y-10 bg-card p-8 rounded-2xl shadow-sm border border-border">

          <FormSection title="รายได้จากงานประจำ (มาตรา 40(1))" description="เงินเดือน โบนัส ค่าล่วงเวลา ตลอดทั้งปี" icon={Briefcase}>
            <div className="grid gap-6 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="income.type40_1"
                render={({ field }) => (
                  <NumberInput
                    label="รวมรายได้ทั้งปี"
                    helperText="เงินเดือน x 12 เดือน + โบนัส"
                    value={field.value}
                    onChangeValue={field.onChange}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="income.withholdingTax"
                render={({ field }) => (
                  <NumberInput
                    label="ภาษีหัก ณ ที่จ่าย"
                    helperText="ดูจากหนังสือรับรอง 50 ทวิ"
                    value={field.value}
                    onChangeValue={field.onChange}
                  />
                )}
              />
            </div>
          </FormSection>

          <FormSection title="ค่าลดหย่อนส่วนตัวและครอบครัว" icon={User}>
            <div className="bg-muted/50 p-4 rounded-lg mb-6 flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full text-primary mt-0.5">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">ลดหย่อนผู้มีเงินได้ 60,000 บาท</h4>
                <p className="text-sm text-muted-foreground mt-1">ระบบจะหักลดหย่อนส่วนตัวให้คุณโดยอัตโนมัติ ไม่ต้องกรอกเพิ่มเติม</p>
              </div>
            </div>

            <div className="space-y-6">
              <Controller
                control={form.control}
                name="allowances.spouse"
                render={({ field }) => (
                  <SwitchToggle
                    label="คู่สมรสไม่มีเงินได้"
                    helperText="จดทะเบียนสมรสและคู่สมรสไม่มีรายได้ (ลดหย่อน 60,000 บาท)"
                    checked={field.value}
                    onChangeChecked={field.onChange}
                  />
                )}
              />

              <div className="grid gap-6 sm:grid-cols-2">
                <Controller
                  control={form.control}
                  name="allowances.children_1"
                  render={({ field }) => (
                    <NumberInput
                      label="จำนวนบุตรเกิดก่อนปี 2561"
                      helperText="ลดหย่อนคนละ 30,000 บาท"
                      value={field.value}
                      onChangeValue={field.onChange}
                      suffix="คน"
                    />
                  )}
                />
                <Controller
                  control={form.control}
                  name="allowances.children_2_plus"
                  render={({ field }) => (
                    <NumberInput
                      label="จำนวนบุตรที่เกิดตั้งแต่ปี 2561 ขึ้นไป"
                      helperText="ลดหย่อนคนละ 60,000 บาท"
                      value={field.value}
                      onChangeValue={field.onChange}
                      suffix="คน"
                    />
                  )}
                />
                <Controller
                  control={form.control}
                  name="allowances.parents"
                  render={({ field }) => (
                    <NumberInput
                      label="บิดามารดาอายุ 60 ปีขึ้นไป"
                      helperText="คนละ 30,000 บาท (สูงสุด 2 คน)"
                      value={field.value}
                      onChangeValue={field.onChange}
                      suffix="คน"
                    />
                  )}
                />
                <Controller
                  control={form.control}
                  name="allowances.disabled"
                  render={({ field }) => (
                    <NumberInput
                      label="อุปการะคนพิการ/ทุพพลภาพ"
                      helperText="คนละ 60,000 บาท"
                      value={field.value}
                      onChangeValue={field.onChange}
                      suffix="คน"
                    />
                  )}
                />
              </div>
            </div>
          </FormSection>

          <FormSection title="ประกันและการลงทุน" icon={PiggyBank}>
            <div className="grid gap-6 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="allowances.socialSecurity"
                render={({ field }) => (
                  <NumberInput
                    label="เงินสมทบประกันสังคม"
                    helperText="ตามที่จ่ายจริง สูงสุดประมาณ 9,000 บาท"
                    value={field.value}
                    onChangeValue={field.onChange}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="allowances.providentFund"
                render={({ field }) => (
                  <NumberInput
                    label="กองทุนสำรองเลี้ยงชีพ / กบข."
                    helperText="ตามจริง ไม่เกิน 15% และ 500,000 บาท"
                    value={field.value}
                    onChangeValue={field.onChange}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="allowances.lifeInsurance"
                render={({ field }) => (
                  <NumberInput
                    label="เบี้ยประกันชีวิต"
                    helperText="ตามจริง ไม่เกิน 100,000 บาท"
                    value={field.value}
                    onChangeValue={field.onChange}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="allowances.healthInsurance"
                render={({ field }) => (
                  <NumberInput
                    label="เบี้ยประกันสุขภาพ"
                    helperText="ตามจริง ไม่เกิน 25,000 บาท"
                    value={field.value}
                    onChangeValue={field.onChange}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="allowances.ssf"
                render={({ field }) => (
                  <NumberInput
                    label="กองทุนรวม SSF"
                    helperText="กองทุนรวมเพื่อส่งเสริมการออมระยะยาว (ถือหน่วยลงทุนอย่างน้อย 10 ปี ไม่มีขั้นต่ำ ไม่ต้องซื้อทุกปี) — ลดหย่อนได้ไม่เกิน 30% ของรายได้ และสูงสุดไม่เกิน 200,000 บาท"
                    value={field.value}
                    onChangeValue={field.onChange}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="allowances.rmf"
                render={({ field }) => (
                  <NumberInput
                    label="กองทุนรวม RMF"
                    helperText="กองทุนรวมเพื่อการเลี้ยงชีพ เพื่อการออมไว้เกษียณ (ถืออย่างน้อย 5 ปี และอายุครบ 55 ปีบริบูรณ์ ต้องซื้อต่อเนื่องทุกปี) — ลดหย่อนได้ไม่เกิน 30% ของรายได้ และสูงสุดไม่เกิน 500,000 บาท"
                    value={field.value}
                    onChangeValue={field.onChange}
                  />
                )}
              />
            </div>
          </FormSection>

          <FormSection title="อสังหาริมทรัพย์และเงินบริจาค" icon={Home}>
            <div className="grid gap-6 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="allowances.homeLoanInterest"
                render={({ field }) => (
                  <NumberInput
                    label="ดอกเบี้ยเงินกู้ยืมเพื่อที่อยู่อาศัย"
                    helperText="ตามจริง ไม่เกิน 100,000 บาท"
                    value={field.value}
                    onChangeValue={field.onChange}
                  />
                )}
              />
              <div className="hidden sm:block"></div>
              <Controller
                control={form.control}
                name="allowances.educationDonation"
                render={({ field }) => (
                  <NumberInput
                    label="เงินบริจาคเพื่อการศึกษา/กีฬา/รพ."
                    helperText="หักได้ 2 เท่า (ไม่เกิน 10% ของเงินได้)"
                    value={field.value}
                    onChangeValue={field.onChange}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="allowances.generalDonation"
                render={({ field }) => (
                  <NumberInput
                    label="เงินบริจาคทั่วไป"
                    helperText="หักได้ตามจริง (ไม่เกิน 10% ของเงินได้)"
                    value={field.value}
                    onChangeValue={field.onChange}
                  />
                )}
              />
            </div>
          </FormSection>

        </div>

        {/* Right Col - Sticky Summary */}
        <div className="lg:col-span-4 relative">
          <TaxSummary result={result} withholdingTax={values.income.withholdingTax} />
        </div>
      </div>
    </div>
  );
}
