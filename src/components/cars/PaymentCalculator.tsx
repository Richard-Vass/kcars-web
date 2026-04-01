"use client";

import { useState } from "react";

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
  const [downPayment, setDownPayment] = useState(Math.round(price * 0.2));
  const [months, setMonths] = useState(48);
  const interestRate = 0.059; // 5.9% p.a.

  const loanAmount = price - downPayment;
  const monthlyRate = interestRate / 12;
  const monthlyPayment =
    loanAmount > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
      : 0;

  return (
    <div className="bg-zinc-900 rounded-xl border border-white/10 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{t.calculator.title}</h3>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-white/60 mb-1 block">{t.calculator.price}</label>
          <div className="text-lg font-semibold text-white">
            {price.toLocaleString()} {t.common.eur}
          </div>
        </div>

        <div>
          <label className="text-sm text-white/60 mb-1 block">
            {t.calculator.downPayment}: {downPayment.toLocaleString()} {t.common.eur}
          </label>
          <input
            type="range"
            min={0}
            max={price}
            step={500}
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full accent-red-500"
          />
          <div className="flex justify-between text-xs text-white/30 mt-1">
            <span>0 {t.common.eur}</span>
            <span>{price.toLocaleString()} {t.common.eur}</span>
          </div>
        </div>

        <div>
          <label className="text-sm text-white/60 mb-1 block">
            {t.calculator.months}: {months}
          </label>
          <input
            type="range"
            min={12}
            max={84}
            step={12}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full accent-red-500"
          />
          <div className="flex justify-between text-xs text-white/30 mt-1">
            <span>12</span>
            <span>84</span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <p className="text-sm text-white/60">{t.calculator.monthlyPayment}</p>
          <p className="text-3xl font-bold text-red-500 mt-1">
            {Math.round(monthlyPayment).toLocaleString()} {t.common.eur}
          </p>
          <p className="text-xs text-white/30 mt-2">* 5,9% p.a., orientačný výpočet</p>
        </div>
      </div>
    </div>
  );
}
