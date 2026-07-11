import React from 'react';
import { CalculationResult, formatTHB } from '../lib/taxCalculation';
import { Info, AlertCircle } from 'lucide-react';

interface TaxSummaryProps {
  result: CalculationResult;
  withholdingTax: number;
}

export function TaxSummary({ result, withholdingTax }: TaxSummaryProps) {
  const netPayable = result.taxLiability - withholdingTax;
  const isRefund = netPayable < 0;

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden sticky top-6">
      <div className="bg-primary/5 border-b border-border p-6">
        <h2 className="text-xl font-bold text-primary mb-1">สรุปผลการคำนวณภาษี</h2>
        <p className="text-sm text-muted-foreground">ผลการคำนวณจะอัปเดตอัตโนมัติตามข้อมูลที่คุณกรอก</p>
      </div>

      <div className="p-6 space-y-5">
        {/* Step-by-step breakdown */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">1. รายได้ทั้งหมด</span>
            <span className="font-mono font-medium">{formatTHB(result.totalIncome)}</span>
          </div>
          <div className="flex justify-between items-center text-red-600 dark:text-red-400">
            <span>2. หัก ค่าใช้จ่าย</span>
            <span className="font-mono">- {formatTHB(result.totalExpenses)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-y border-border/50">
            <span className="font-medium text-foreground">รายได้หลังหักค่าใช้จ่าย</span>
            <span className="font-mono font-semibold text-foreground">{formatTHB(result.incomeAfterExpenses)}</span>
          </div>
          <div className="flex justify-between items-center text-red-600 dark:text-red-400">
            <span>3. หัก ค่าลดหย่อนรวม</span>
            <span className="font-mono">- {formatTHB(result.totalAllowances + result.educationDonationDeductible + result.generalDonationDeductible)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-y border-border/50 bg-muted/30 px-2 rounded -mx-2">
            <span className="font-bold text-base text-foreground">เงินได้สุทธิ</span>
            <span className="font-mono font-bold text-base text-foreground">{formatTHB(result.netTaxableIncome)}</span>
          </div>
        </div>

        {/* Brackets Visualization */}
        <div className="mt-6 pt-4 border-t border-border">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-primary" />
            ตารางคำนวณภาษีตามขั้นบันได
          </h3>
          <div className="space-y-1.5">
            {result.brackets.filter(b => b.taxableAmount > 0 || b.min === 0).map((bracket, i) => (
              <div key={i} className={`flex flex-col p-2.5 rounded text-xs gap-1.5 ${bracket.taxableAmount > 0 && bracket.rate > 0 ? 'bg-primary/5 border border-primary/10' : 'text-muted-foreground bg-muted/20'}`}>
                <div className="flex justify-between items-center font-semibold text-foreground">
                  <span>{bracket.min.toLocaleString()} - {bracket.max ? bracket.max.toLocaleString() : 'ขึ้นไป'} ({bracket.rate * 100}%)</span>
                  <span className="font-mono text-primary font-bold">
                    {bracket.taxInBracket > 0 ? `${formatTHB(bracket.taxInBracket)}` : 'ยกเว้น'}
                  </span>
                </div>
                {bracket.taxableAmount > 0 && (
                  <div className="flex justify-between text-[10px] text-muted-foreground/80 font-mono">
                    <span>เงินได้สุทธิในขั้น:</span>
                    <span>{formatTHB(bracket.taxableAmount)} บาท</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Filing Obligation Status */}
        <div className={`p-4 rounded-xl border flex gap-3 text-xs leading-relaxed ${
          result.hasFilingObligation 
            ? 'bg-red-50/50 border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-300' 
            : 'bg-emerald-50/50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-300'
        }`}>
          <div className={`p-1.5 rounded-lg h-fit ${
            result.hasFilingObligation ? 'bg-red-100 dark:bg-red-900/40' : 'bg-emerald-100 dark:bg-emerald-900/40'
          }`}>
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-sm">
              {result.hasFilingObligation ? '⚠️ คุณมีหน้าที่ต้องยื่นแบบภาษี (ต้องส่งภาษี)' : '✅ คุณไม่มีหน้าที่ต้องยื่นแบบภาษี'}
            </div>
            <p className="text-muted-foreground">{result.filingObligationReason}</p>
          </div>
        </div>

        {/* Final Result */}
        <div className="mt-8 p-5 bg-muted rounded-xl space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">ภาษีที่คำนวณได้</span>
            <span className="font-mono font-semibold">{formatTHB(result.taxLiability)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">หัก ภาษี ณ ที่จ่าย</span>
            <span className="font-mono text-red-600">- {formatTHB(withholdingTax)}</span>
          </div>
          <div className={`flex justify-between items-center p-3 rounded-lg border ${
            isRefund 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400' 
              : 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-400'
          }`}>
            <div className="flex items-center gap-2 font-bold text-lg">
              {isRefund ? (
                <>ได้เงินคืน</>
              ) : (
                <>ต้องชำระเพิ่ม</>
              )}
            </div>
            <span className="font-mono font-bold text-xl">
              {formatTHB(Math.abs(netPayable))}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
