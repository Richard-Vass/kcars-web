"use client";

import { useState } from "react";

// VÚB monthly rates by term
const vubRates: Record<number, number> = {
  12: 0.0160, 24: 0.0155, 36: 0.0150,
  48: 0.014618, 60: 0.013780, 72: 0.013248,
  84: 0.012879, 96: 0.012620,
};

function getRate(months: number): number {
  const keys = Object.keys(vubRates).map(Number).sort((a, b) => a - b);
  let closest = keys[0];
  for (const k of keys) {
    if (Math.abs(k - months) < Math.abs(closest - months)) closest = k;
  }
  return vubRates[closest];
}

interface PaymentCalculatorProps {
  price: number;
  t: {
    calculator: {
      title: string;
      price: string;
      downPayment: string;
      months: string;
      monthlyPayment: string;
    };
    common: { eur: string };
  };
}

export default function PaymentCalculator({ price, t }: PaymentCalculatorProps) {
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [months, setMonths] = useState(48);

  const downPayment = Math.round(price * (downPaymentPct / 100));
  const loanAmount = price - downPayment;
  const monthlyRate = getRate(months);

  const monthlyPayment =
    loanAmount > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
      : 0;

  const totalPaid = monthlyPayment * months + downPayment;
  const koeficient = price > 0 ? totalPaid / price : 0;

  return (
    <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-6">
      <h3 className="text-lg font-semibold text-[#f0f2f5] mb-4">{t.calculator.title}</h3>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-[#8b9bb4] mb-1 block">{t.calculator.price}</label>
          <div className="text-lg font-semibold text-[#f0f2f5]">
            {price.toLocaleString()} {t.common.eur}
          </div>
        </div>

        <div>
          <label className="text-sm text-[#8b9bb4] mb-1 block">
            {t.calculator.downPayment}: {downPaymentPct}% ({downPayment.toLocaleString()} {t.common.eur})
          </label>
          <input
            type="range"
            min={0}
            max={50}
            step={10}
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
            className="w-full accent-[#ef4444]"
          />
          <div className="flex justify-between text-xs text-[#8b9bb4] mt-1">
            <span>0%</span>
            <span>50%</span>
          </div>
        </div>

        <div>
          <label className="text-sm text-[#8b9bb4] mb-1 block">
            {t.calculator.months}: {months}
          </label>
          <input
            type="range"
            min={12}
            max={96}
            step={12}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full accent-[#ef4444]"
          />
          <div className="flex justify-between text-xs text-[#8b9bb4] mt-1">
            <span>12</span>
            <span>96</span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <p className="text-sm text-[#8b9bb4]">{t.calculator.monthlyPayment}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-[#ef4444] to-[#f97316] bg-clip-text text-transparent mt-1">
            {Math.round(monthlyPayment).toLocaleString()} {t.common.eur}
          </p>
          <div className="flex justify-between text-xs text-[#8b9bb4] mt-3">
            <span>Koeficient: {koeficient.toFixed(2)}</span>
            <span>Celkom: {Math.round(totalPaid).toLocaleString()} €</span>
          </div>
          <p className="text-xs text-[#8b9bb4]/70 mt-2">* Orientačný výpočet, VÚB Banka</p>
        </div>
      </div>
    </div>
  );
}
