import { Link } from 'wouter';
import { FileText, Briefcase, User, CalendarDays, ArrowRight, ShieldCheck, BookOpen, Heart, Layers, Scale, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
export function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b border-border py-6 px-6 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2.5 rounded-xl text-primary-foreground shadow-md">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground leading-none">ThaiTax</h1>
              <p className="text-sm text-muted-foreground mt-1 font-medium">โปรแกรมคำนวณภาษีเงินได้บุคคลธรรมดา</p>
            </div>
          </div>
          <Link href="/test-suite" className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            รันระบบทดสอบภาษี
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl font-bold tracking-tight text-foreground">
            เลือกแบบฟอร์มภาษีของคุณ
          </h2>
          <p className="text-lg text-muted-foreground">
            คำนวณภาษีเงินได้ประจำปีอย่างแม่นยำ พร้อมแสดงรายละเอียดรายขั้น เพื่อการวางแผนการเงินที่ดีกว่า
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          <Link href="/91" className="group block h-full">
            <div className="bg-card hover:border-primary/50 border border-border rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110"></div>
              
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-xl w-fit mb-6">
                <User className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">ภ.ง.ด. 91</h3>
              <p className="font-semibold text-primary/80 mb-4">สำหรับมนุษย์เงินเดือน</p>
              
              <p className="text-muted-foreground text-sm flex-1 mb-8">
                ผู้มีรายได้จากงานประจำเพียงอย่างเดียว (มาตรา 40(1)) เช่น เงินเดือน โบนัส ค่าล่วงเวลา
              </p>
              
              <div className="flex items-center text-primary font-medium text-sm mt-auto">
                เริ่มต้นคำนวณ <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          <Link href="/90" className="group block h-full">
            <div className="bg-card hover:border-primary/50 border border-border rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110"></div>
              
              <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl w-fit mb-6">
                <Briefcase className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">ภ.ง.ด. 90</h3>
              <p className="font-semibold text-primary/80 mb-4">สำหรับผู้มีรายได้หลายทาง</p>
              
              <p className="text-muted-foreground text-sm flex-1 mb-8">
                ผู้มีรายได้ประเภทอื่นๆ หรือมีทั้งเงินเดือนและรายได้อื่นร่วมด้วย (มาตรา 40(1) - 40(8)) ฟรีแลนซ์ พ่อค้าแม่ค้า ดอกเบี้ย ค่าเช่า
              </p>
              
              <div className="flex items-center text-primary font-medium text-sm mt-auto">
                เริ่มต้นคำนวณ <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          <Link href="/94" className="group block h-full">
            <div className="bg-card hover:border-primary/50 border border-border rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110"></div>
              
              <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 p-3 rounded-xl w-fit mb-6">
                <CalendarDays className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">ภ.ง.ด. 94</h3>
              <p className="font-semibold text-primary/80 mb-4">ภาษีครึ่งปี</p>
              
              <p className="text-muted-foreground text-sm flex-1 mb-8">
                การยื่นภาษีกลางปี สำหรับผู้มีรายได้มาตรา 40(5) - 40(8) ที่เกิดขึ้นในช่วงครึ่งปีแรก (ม.ค. - มิ.ย.)
              </p>
              
              <div className="flex items-center text-primary font-medium text-sm mt-auto">
                เริ่มต้นคำนวณ <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

        </div>

        {/* คู่มือภาษี & เกณฑ์ลดหย่อน (Tax Guide) */}
        <div className="mt-16 space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="bg-primary/10 text-primary p-2.5 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">คู่มือและกฎเกณฑ์ลดหย่อนภาษีปี 2569</h2>
              <p className="text-xs text-muted-foreground mt-0.5">อ้างอิงตามหลักกฎหมายภาษีสรรพากรสำหรับคำนวณแบบ ภ.ง.ด. 90 / 91 / 94</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Category 1: Filing Thresholds */}
            <Card className="bg-card">
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
            <Card className="bg-card">
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
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                  <Heart className="w-4 h-4" /> ค่าลดหย่อนส่วนตัวและครอบครัว (Family Allowances)
                </CardTitle>
                <CardDescription className="text-[10px]">สิทธิลดหย่อนพื้นฐานสำหรับผู้มีเงินได้และครอบครัว</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-border/40 pb-1.5 text-[11px]">
                  <span className="text-muted-foreground">ลดหย่อนส่วนตัว (ผู้มีเงินได้)</span>
                  <span className="font-semibold text-foreground">60,000 บาท/ปี (ยื่นครึ่งปีลดเหลือ 30,000 บาท)</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-1.5 text-[11px]">
                  <span className="text-muted-foreground">คู่สมรส (จดทะเบียน และไม่มีรายได้)</span>
                  <span className="font-semibold text-foreground">60,000 บาท/ปี (ยื่นครึ่งปีลดเหลือ 30,000 บาท)</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-1.5 text-[11px]">
                  <span className="text-muted-foreground">บุตรคนที่ 1 และคนที่ 2 ขึ้นไป</span>
                  <span className="font-semibold text-foreground">คนแรก 30,000 บาท / คนถัดไปคนละ 60,000 บาท</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-1.5 text-[11px]">
                  <span className="text-muted-foreground">อุปการะบิดามารดา (อายุ 60 ปีขึ้นไป และรายได้ไม่เกิน 30k)</span>
                  <span className="font-semibold text-foreground">คนละ 30,000 บาท (สูงสุดคนละ 4 ท่าน)</span>
                </div>
                <div className="flex justify-between pb-1 text-[11px]">
                  <span className="text-muted-foreground">อุปการะผู้พิการหรือทุพพลภาพ</span>
                  <span className="font-semibold text-foreground">คนละ 60,000 บาท</span>
                </div>
              </CardContent>
            </Card>

            {/* Category 4: Retirement and Savings Capping */}
            <Card className="bg-card">
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
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">กองทุน SSF:</span>
                    <span className="font-semibold text-foreground">หักได้สูงสุด 30% ของรายได้ ไม่เกิน 200,000 บาท</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">กองทุน RMF:</span>
                    <span className="font-semibold text-foreground">หักได้สูงสุด 30% ของรายได้ ไม่เกิน 500,000 บาท</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ประกันบำนาญ:</span>
                    <span className="font-semibold text-foreground">หักได้สูงสุด 15% ของรายได้ ไม่เกิน 200,000 บาท</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category 5: Insurance & Interest */}
            <Card className="bg-card md:col-span-2">
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
            <Card className="bg-card md:col-span-2">
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
      </main>
      
      <footer className="border-t border-border py-8 text-center text-muted-foreground text-sm">
        <p>เครื่องมือคำนวณเบื้องต้นเพื่อการวางแผนภาษี ไม่สามารถใช้เป็นหลักฐานอ้างอิงทางกฎหมายกับกรมสรรพากรได้</p>
      </footer>
    </div>
  );
}
