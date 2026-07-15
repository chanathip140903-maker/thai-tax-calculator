import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  FileText, Briefcase, User, CalendarDays, ArrowRight, BookOpen, 
  Heart, Layers, Scale, DollarSign, Wallet, TrendingUp, Info, HelpCircle 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Home() {
  const [location] = useLocation();
  const [monthlySalary, setMonthlySalary] = useState<number>(30000);
  const [extraDeductions, setExtraDeductions] = useState<number>(0);

  // Calculation Logic for Quick Tax Estimator
  const annualSalary = monthlySalary * 12;
  const expenses = Math.min(annualSalary * 0.5, 100000); // 50% max 100,000
  const personalDeduction = 60000;
  const totalDeductions = personalDeduction + extraDeductions;
  const taxableIncome = Math.max(0, annualSalary - expenses - totalDeductions);

  // Progressive Tax Bracket Calculation
  const calculateEstimatedTax = (netIncome: number): number => {
    let tax = 0;
    const brackets = [
      { limit: 150000, rate: 0 },
      { limit: 300000, rate: 0.05 },
      { limit: 500000, rate: 0.10 },
      { limit: 750000, rate: 0.15 },
      { limit: 1000000, rate: 0.20 },
      { limit: 2000000, rate: 0.25 },
      { limit: 5000000, rate: 0.30 },
      { limit: Infinity, rate: 0.35 }
    ];
    
    let prevLimit = 0;
    for (const b of brackets) {
      if (netIncome > prevLimit) {
        const taxableAmount = Math.min(netIncome - prevLimit, b.limit - prevLimit);
        tax += taxableAmount * b.rate;
        prevLimit = b.limit;
      } else {
        break;
      }
    }
    return tax;
  };

  const estimatedTax = calculateEstimatedTax(taxableIncome);
  const effectiveTaxRate = annualSalary > 0 ? (estimatedTax / annualSalary) * 100 : 0;
  const monthlyTax = estimatedTax / 12;
  const monthlyTakeHome = monthlySalary - monthlyTax;

  // Active Bracket Index Helper
  const getTaxBracketIndex = (netIncome: number): number => {
    const brackets = [150000, 300000, 500000, 750000, 1000000, 2000000, 5000000];
    for (let i = 0; i < brackets.length; i++) {
      if (netIncome <= brackets[i]) return i;
    }
    return 7;
  };

  const activeBracketIndex = getTaxBracketIndex(taxableIncome);

  const taxLadderBrackets = [
    { range: '0 - 150,000 บาท', rate: '0% (ยกเว้น)', desc: 'ได้รับการยกเว้นภาษี' },
    { range: '150,001 - 300,000 บาท', rate: '5%', desc: 'ภาษีสูงสุดสะสม 7,500 บาท' },
    { range: '300,001 - 500,000 บาท', rate: '10%', desc: 'ภาษีสะสมสูงสุด 27,500 บาท' },
    { range: '500,001 - 750,000 บาท', rate: '15%', desc: 'ภาษีสะสมสูงสุด 65,000 บาท' },
    { range: '750,001 - 1,000,000 บาท', rate: '20%', desc: 'ภาษีสะสมสูงสุด 115,000 บาท' },
    { range: '1,000,001 - 2,000,000 บาท', rate: '25%', desc: 'ภาษีสะสมสูงสุด 365,000 บาท' },
    { range: '2,000,001 - 5,000,000 บาท', rate: '30%', desc: 'ภาษีสะสมสูงสุด 1,265,000 บาท' },
    { range: '5,000,001 บาท ขึ้นไป', rate: '35%', desc: 'คิดอัตรา 35% ของส่วนที่เกิน 5 ล้าน' }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
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

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        {/* Welcome Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            เครื่องมือประเมินและวางแผนภาษี
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            ปรับรายรับและค่าลดหย่อนเพื่อประเมินภาษีแบบเรียลไทม์ และเลือกแบบฟอร์มเพื่อเข้าคำนวณฉบับเต็ม
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-12 gap-8 mb-16">
          
          {/* Left Column - Estimator Sliders & Results (7 Cols) */}
          <Card className="lg:col-span-7 bg-card border-border shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-primary">
                <Wallet className="w-5 h-5" /> ประเมินภาษีรายเดือนด่วน (Quick Estimator)
              </CardTitle>
              <CardDescription className="text-xs">
                ปรับแต่งข้อมูลรายได้และค่าลดหย่อนเพื่อจำลองอัตราภาษีทันที
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Slider 1: Monthly Salary */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-foreground">เงินเดือนเฉลี่ยรายเดือน (Monthly Salary)</span>
                  <span className="font-mono text-primary font-bold text-base">
                    {monthlySalary.toLocaleString('th-TH')} บาท
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={300000}
                  step={1000}
                  value={monthlySalary}
                  onChange={(e) => setMonthlySalary(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                />
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5">
                  <span className="text-xs text-muted-foreground">ป้อนยอดตัวเลขโดยละเอียด:</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={monthlySalary || ''}
                      onChange={(e) => setMonthlySalary(Math.min(500000, Math.max(0, Number(e.target.value))))}
                      className="w-28 text-right bg-transparent border-none outline-none font-mono font-bold text-foreground text-sm"
                      placeholder="0"
                    />
                    <span className="text-xs text-muted-foreground font-medium">บาท/เดือน</span>
                  </div>
                </div>
              </div>

              {/* Slider 2: Extra Deductions */}
              <div className="space-y-2.5 border-t border-border/60 pt-5">
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-semibold text-foreground block">ค่าลดหย่อนและการลงทุนเพิ่มเติม</span>
                    <span className="text-[10px] text-muted-foreground block">(เช่น SSF, RMF, ประกันชีวิต, PVD, ดอกเบี้ยบ้าน)</span>
                  </div>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-base">
                    + {extraDeductions.toLocaleString('th-TH')} บาท
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={500000}
                  step={5000}
                  value={extraDeductions}
                  onChange={(e) => setExtraDeductions(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
                />
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5">
                  <span className="text-xs text-muted-foreground">ป้อนยอดตัวเลขโดยละเอียด:</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={extraDeductions || ''}
                      onChange={(e) => setExtraDeductions(Math.min(1000000, Math.max(0, Number(e.target.value))))}
                      className="w-28 text-right bg-transparent border-none outline-none font-mono font-bold text-foreground text-sm"
                      placeholder="0"
                    />
                    <span className="text-xs text-muted-foreground font-medium">บาท/ปี</span>
                  </div>
                </div>
              </div>

              {/* Results Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border/60 pt-6">
                
                {/* Result 1: Estimated Annual Tax */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-xs text-muted-foreground font-semibold">ภาษีประเมินต่อปี</span>
                  <div className="mt-2">
                    <span className="text-2xl font-black text-primary">
                      {estimatedTax > 0 ? `${estimatedTax.toLocaleString('th-TH')} บาท` : '0 บาท'}
                    </span>
                    {estimatedTax > 0 && (
                      <span className="text-[10px] text-muted-foreground block mt-1">
                        หรือประมาณ {Math.round(monthlyTax).toLocaleString('th-TH')} บาท/เดือน
                      </span>
                    )}
                  </div>
                </div>

                {/* Result 2: Monthly Take Home */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-xs text-muted-foreground font-semibold">รายรับหลังหักภาษีต่อเดือน</span>
                  <div className="mt-2">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {monthlyTakeHome.toLocaleString('th-TH')} บาท
                    </span>
                    <span className="text-[10px] text-muted-foreground block mt-1">
                      (เงินเดือนหลังประมาณการหักภาษี)
                    </span>
                  </div>
                </div>

                {/* Result 3: Taxable Net Income */}
                <div className="bg-slate-500/5 border border-slate-500/20 rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-xs text-muted-foreground font-semibold">เงินได้สุทธิที่นำมาคำนวณภาษี</span>
                  <div className="mt-2">
                    <span className="text-base font-bold text-foreground block">
                      {taxableIncome.toLocaleString('th-TH')} บาท/ปี
                    </span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">
                      หักใช้จ่าย {expenses.toLocaleString('th-TH')} | ลดหย่อน {totalDeductions.toLocaleString('th-TH')}
                    </span>
                  </div>
                </div>

                {/* Result 4: Effective Tax Rate */}
                <div className="bg-slate-500/5 border border-slate-500/20 rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-xs text-muted-foreground font-semibold">อัตราภาษีแท้จริง (Effective Rate)</span>
                  <div className="mt-2">
                    <span className="text-base font-bold text-foreground block">
                      {effectiveTaxRate.toFixed(2)} %
                    </span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">
                      คำนวณจากรายรับรวมรายปี
                    </span>
                  </div>
                </div>

              </div>

            </CardContent>
          </Card>

          {/* Right Column - Visual Tax Ladder (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-md sticky top-28">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> ขั้นบันไดอัตราภาษีเงินได้ที่อยู่ของคุณ
              </h3>
              
              <div className="space-y-2">
                {taxLadderBrackets.map((bracket, index) => {
                  const isActive = index === activeBracketIndex;
                  return (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all duration-300 ${
                        isActive 
                          ? 'bg-primary/10 border-primary text-foreground shadow-[0_0_12px_rgba(59,130,246,0.15)] font-semibold scale-[1.02]' 
                          : 'border-border/60 text-muted-foreground/80 bg-muted/5'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className={isActive ? 'text-foreground font-bold' : ''}>{bracket.range}</span>
                        <span className="text-[10px] text-muted-foreground/60">{bracket.desc}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isActive && (
                          <span className="bg-primary text-primary-foreground text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase animate-pulse">
                            คุณอยู่ขั้นนี้
                          </span>
                        )}
                        <span className={`text-right font-mono font-bold ${isActive ? 'text-primary text-sm' : ''}`}>
                          {bracket.rate}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-muted/40 p-3 rounded-lg text-[10px] text-muted-foreground leading-relaxed flex gap-2">
                <Info className="w-4 h-4 shrink-0 text-primary mt-0.5" />
                <p>
                  * ขั้นบันไดภาษีเป็นแบบก้าวหน้า เงินได้สุทธิจะถูกนำมาเฉลี่ยคิดแยกอัตราตามแต่ละขั้นสะสมขึ้นไปเรื่อยๆ จนเต็มจำนวน
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Full Form Selection Section */}
        <div className="mt-16 space-y-6">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h3 className="text-2xl font-bold text-foreground">ต้องการยื่นแบบและรับเอกสารคำนวณฉบับเต็ม?</h3>
            <p className="text-sm text-muted-foreground">
              เลือกแบบฟอร์มที่ต้องการเพื่อป้อนรายละเอียดภาษีขั้นสูง ดาวน์โหลดสรุปภาษี หรือตรวจสอบสิทธิ์ต่างๆ
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Form 91 */}
            <Link href="/91" className="group block h-full">
              <div className="bg-card hover:border-primary/50 border border-border rounded-2xl p-7 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110"></div>
                
                {/* Recommendation Indicator */}
                {monthlySalary > 0 && extraDeductions === 0 && (
                  <span className="absolute top-3 right-3 bg-primary/10 text-primary border border-primary/20 text-[9px] font-bold px-2 py-0.5 rounded-full z-10">
                    แนะนำสำหรับคุณ
                  </span>
                )}

                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-xl w-fit mb-5">
                  <User className="w-7 h-7" />
                </div>
                
                <h3 className="text-xl font-bold mb-1 text-foreground group-hover:text-primary transition-colors">ภ.ง.ด. 91</h3>
                <p className="font-semibold text-primary/80 text-xs mb-3">สำหรับมนุษย์เงินเดือน</p>
                
                <p className="text-muted-foreground text-xs flex-1 mb-6 leading-relaxed">
                  ผู้มีรายได้จากเงินเดือนประจำ/โบนัสเพียงอย่างเดียว (มาตรา 40(1)) เช่น พนักงานบริษัท ข้าราชการ
                </p>
                
                <div className="flex items-center text-primary font-bold text-xs mt-auto">
                  กรอกข้อมูล ภ.ง.ด. 91 <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Form 90 */}
            <Link href="/90" className="group block h-full">
              <div className="bg-card hover:border-primary/50 border border-border rounded-2xl p-7 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110"></div>
                
                {/* Recommendation Indicator */}
                {extraDeductions > 0 && (
                  <span className="absolute top-3 right-3 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full z-10">
                    มีสิทธิลดหย่อนเพิ่ม
                  </span>
                )}

                <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl w-fit mb-5">
                  <Briefcase className="w-7 h-7" />
                </div>
                
                <h3 className="text-xl font-bold mb-1 text-foreground group-hover:text-primary transition-colors">ภ.ง.ด. 90</h3>
                <p className="font-semibold text-primary/80 text-xs mb-3">สำหรับผู้มีรายได้หลายทาง</p>
                
                <p className="text-muted-foreground text-xs flex-1 mb-6 leading-relaxed">
                  ฟรีแลนซ์, พ่อค้าแม่ค้า, ค่าเช่า, ลิขสิทธิ์ หรือผู้มีรายได้ประเภทเงินเดือนร่วมกับรายได้อื่นๆ (ม.40(1) - 40(8))
                </p>
                
                <div className="flex items-center text-primary font-bold text-xs mt-auto">
                  กรอกข้อมูล ภ.ง.ด. 90 <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Form 94 */}
            <Link href="/94" className="group block h-full">
              <div className="bg-card hover:border-primary/50 border border-border rounded-2xl p-7 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110"></div>
                
                <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 p-3 rounded-xl w-fit mb-5">
                  <CalendarDays className="w-7 h-7" />
                </div>
                
                <h3 className="text-xl font-bold mb-1 text-foreground group-hover:text-primary transition-colors">ภ.ง.ด. 94</h3>
                <p className="font-semibold text-primary/80 text-xs mb-3">ภาษีครึ่งปี (ม.ค. - มิ.ย.)</p>
                
                <p className="text-muted-foreground text-xs flex-1 mb-6 leading-relaxed">
                  การยื่นภาษีครึ่งปีแรก สำหรับผู้มีรายได้ประเภท ม.40(5) ค่าเช่า, ม.40(6) วิชาชีพอิสระ, ม.40(7) รับเหมา, และ ม.40(8) ค้าขายออนไลน์
                </p>
                
                <div className="flex items-center text-primary font-bold text-xs mt-auto">
                  กรอกข้อมูล ภ.ง.ด. 94 <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

          </div>
        </div>

        {/* Collapsible Tax Guide & Rules (Accordion) */}
        <div className="mt-20 space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="bg-primary/10 text-primary p-2.5 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">คู่มือและกฎเกณฑ์ลดหย่อนภาษีปี 2569</h2>
              <p className="text-xs text-muted-foreground mt-0.5">อ้างอิงตามหลักกฎหมายภาษีสรรพากรสำหรับคำนวณแบบ ภ.ง.ด. 90 / 91 / 94</p>
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            
            {/* Item 1: Filing Thresholds */}
            <AccordionItem value="thresholds" className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-sm">
              <AccordionTrigger className="px-6 py-4 font-bold text-sm text-foreground flex items-center justify-between hover:no-underline hover:bg-muted/10 transition-colors">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-primary" />
                  <span>เกณฑ์หน้าที่การยื่นแบบภาษี (Filing Duty)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2 text-xs space-y-4">
                <div className="grid md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-1">
                    <strong className="text-foreground text-[13px] block">ยื่นแบบปลายปี (ภ.ง.ด. 90 / 91)</strong>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1 text-[11px] leading-relaxed">
                      <li><span className="font-semibold text-foreground">คนโสด (มีเงินเดือนอย่างเดียว):</span> ต้องยื่นเมื่อรายได้รวม &gt; 120,000 บาท/ปี</li>
                      <li><span className="font-semibold text-foreground">คนโสด (มีรายได้ทางอื่นด้วย):</span> ต้องยื่นเมื่อรายได้รวม &gt; 60,000 บาท/ปี</li>
                      <li><span className="font-semibold text-foreground">สมรส (มีเงินเดือนอย่างเดียว):</span> ต้องยื่นเมื่อรายได้รวม &gt; 220,000 บาท/ปี</li>
                      <li><span className="font-semibold text-foreground">สมรส (มีรายได้ทางอื่นด้วย):</span> ต้องยื่นเมื่อรายได้รวม &gt; 120,000 บาท/ปี</li>
                    </ul>
                  </div>
                  <div className="space-y-1 border-t md:border-t-0 md:border-l border-border/50 pt-3 md:pt-0 md:pl-6">
                    <strong className="text-foreground text-[13px] block">ยื่นแบบครึ่งปี (ภ.ง.ด. 94)</strong>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
                      สำหรับผู้มีรายได้ ม.40(5) - (8) ในช่วงครึ่งปีแรก:
                    </p>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1 text-[11px] leading-relaxed">
                      <li><span className="font-semibold text-foreground">คนโสด:</span> ต้องยื่นเมื่อรายได้ครึ่งปี &gt; 60,000 บาท</li>
                      <li><span className="font-semibold text-foreground">สมรส:</span> ต้องยื่นเมื่อรายได้ครึ่งปี &gt; 120,000 บาท</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Item 2: Expense Deductions */}
            <AccordionItem value="expenses" className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-sm">
              <AccordionTrigger className="px-6 py-4 font-bold text-sm text-foreground flex items-center justify-between hover:no-underline hover:bg-muted/10 transition-colors">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span>อัตราการหักค่าใช้จ่ายแยกประเภทรายได้ (Expense Deductions)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2 text-xs">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <span className="font-semibold block text-foreground">ม.40(1) และ 40(2) (เงินเดือน/รับจ้าง)</span>
                    <span className="text-muted-foreground block mt-1 text-[11px]">หักเหมา 50% สูงสุดไม่เกิน 100,000 บาท</span>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <span className="font-semibold block text-foreground">ม.40(3) (ค่าลิขสิทธิ์/สิทธิ์ทางปัญญา)</span>
                    <span className="text-muted-foreground block mt-1 text-[11px]">หักเหมา 50% สูงสุดไม่เกิน 100,000 บาท</span>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <span className="font-semibold block text-foreground">ม.40(5) (ค่าเช่าทรัพย์สิน)</span>
                    <span className="text-muted-foreground block mt-1 text-[11px]">หักเหมา 30% ของรายได้</span>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <span className="font-semibold block text-foreground">ม.40(6) (วิชาชีพอิสระ)</span>
                    <span className="text-muted-foreground block mt-1 text-[11px]">แพทย์หัก 60% / อื่นๆ (วิศวกร/ทนาย) หัก 30%</span>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg md:col-span-2">
                    <span className="font-semibold block text-foreground">ม.40(7) (รับเหมา) และ ม.40(8) (ค้าขายออนไลน์/อื่นๆ)</span>
                    <span className="text-muted-foreground block mt-1 text-[11px]">หักเหมา 60% ของรายได้</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Item 3: Standard Allowances */}
            <AccordionItem value="allowances" className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-sm">
              <AccordionTrigger className="px-6 py-4 font-bold text-sm text-foreground flex items-center justify-between hover:no-underline hover:bg-muted/10 transition-colors">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary" />
                  <span>ค่าลดหย่อนส่วนตัวและครอบครัว (Family Allowances)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2 text-xs space-y-3">
                <div className="space-y-2.5 pt-2">
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
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Item 4: Retirement Group Cap */}
            <AccordionItem value="retirement" className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-sm">
              <AccordionTrigger className="px-6 py-4 font-bold text-sm text-foreground flex items-center justify-between hover:no-underline hover:bg-muted/10 transition-colors">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <span>กลุ่มเกษียณอายุและการลงทุน (Retirement Group Cap)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2 text-xs space-y-4">
                <div className="bg-amber-500/5 border border-amber-500/20 p-3 rounded-lg text-[11px] text-amber-800 dark:text-amber-300 mt-2">
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
              </AccordionContent>
            </AccordionItem>

            {/* Item 5: Insurance & Donations */}
            <AccordionItem value="insurance" className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-sm">
              <AccordionTrigger className="px-6 py-4 font-bold text-sm text-foreground flex items-center justify-between hover:no-underline hover:bg-muted/10 transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>ประกัน, ดอกเบี้ยบ้าน, และเงินบริจาค (Insurance & Donations)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2 text-xs">
                <div className="grid md:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1 text-[11px]">
                    <strong className="text-foreground block">ประกันชีวิตและสุขภาพ</strong>
                    <p className="text-muted-foreground leading-relaxed text-[10px] mt-1">
                      - ประกันชีวิตหักได้ตามจริง ไม่เกิน **100,000 บาท**<br/>
                      - ประกันสุขภาพหักได้สูงสุด **25,000 บาท**<br/>
                      - *ผลรวมกลุ่มประกันชีวิตและสุขภาพทั่วไป ต้องไม่เกิน 100,000 บาท*
                    </p>
                  </div>
                  <div className="space-y-1 text-[11px] border-t md:border-t-0 md:border-l border-border/60 pt-2 md:pt-0 md:pl-4">
                    <strong className="text-foreground block">ดอกเบี้ยกู้ซื้อบ้าน</strong>
                    <p className="text-muted-foreground leading-relaxed text-[10px] mt-1">
                      หักลดหย่อนได้ตามจำนวนที่ชำระดอกเบี้ยกู้บ้านจริงให้แก่สถาบันการเงิน สูงสุดไม่เกิน **100,000 บาท**
                    </p>
                  </div>
                  <div className="space-y-1 text-[11px] border-t md:border-t-0 md:border-l border-border/60 pt-2 md:pt-0 md:pl-4">
                    <strong className="text-foreground block">เงินบริจาคและข้อจำกัดเพดาน</strong>
                    <p className="text-muted-foreground leading-relaxed text-[10px] mt-1">
                      - **บริจาคเพื่อการศึกษา/กีฬา/รพ.รัฐ**: หักได้ **2 เท่าของจ่ายจริง** แต่สูงสุดไม่เกิน **10% ของเงินได้สุทธิ**ก่อนบริจาคทั่วไป<br/>
                      - **บริจาคทั่วไป**: หักได้ตามจริง สูงสุดไม่เกิน **10% ของเงินได้สุทธิ**คงเหลือ
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Item 6: Tax Brackets Table */}
            <AccordionItem value="table" className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-sm">
              <AccordionTrigger className="px-6 py-4 font-bold text-sm text-foreground flex items-center justify-between hover:no-underline hover:bg-muted/10 transition-colors">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span>ตารางฐานอัตราภาษีเงินได้บุคคลธรรมดาแบบก้าวหน้า (Tax Brackets Table)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2 text-xs">
                <Table className="text-xs mt-2">
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
                      <TableCell className="text-right">คิดอัตรา 35% ของส่วนต่างที่เกิน 5 ล้านบาท</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </div>

      </main>

      <footer className="border-t border-border py-8 text-center text-muted-foreground text-xs">
        <p>เครื่องมือคำนวณเบื้องต้นเพื่อการวางแผนภาษี ไม่สามารถใช้เป็นหลักฐานอ้างอิงทางกฎหมายกับกรมสรรพากรได้</p>
      </footer>
    </div>
  );
}
