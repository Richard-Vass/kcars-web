"use client";

import { useState } from "react";

const rates = [
  { name: "Štandard", rate: 0.069, desc: "Bežný spotrebiteľský úver" },
  { name: "Akcia", rate: 0.049, desc: "Akciová sadzba pre vybrané modely" },
  { name: "Leasing", rate: 0.039, desc: "Finančný leasing pre podnikateľov" },
];

export default function LeasingPage() {
  const [price, setPrice] = useState(20000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [months, setMonths] = useState(48);
  const [selectedRate, setSelectedRate] = useState(0);

  const downPayment = Math.round(price * (downPaymentPct / 100));
  const loanAmount = price - downPayment;
  const monthlyRate = rates[selectedRate].rate / 12;

  const monthlyPayment =
    loanAmount > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
      : 0;

  const totalPaid = monthlyPayment * months + downPayment;
  const totalInterest = totalPaid - price;

  const inputClass = "w-full bg-[#060a12] border border-white/5 rounded-xl px-4 py-3 text-sm text-[#f0f2f5] focus:border-[#ef4444]/50 focus:outline-none transition-colors";

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center gap-3 justify-center mb-3">
            <div className="w-8 h-0.5 bg-gradient-to-r from-[#ef4444] to-[#f97316] rounded-full" />
            <span className="text-xs font-semibold uppercase tracking-[2px] text-[#f87171]">Financovanie</span>
            <div className="w-8 h-0.5 bg-gradient-to-r from-[#f97316] to-[#ef4444] rounded-full" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#f0f2f5]" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
            Leasingová kalkulačka
          </h1>
          <p className="text-[#94a3b8] mt-3 max-w-lg mx-auto">
            Vypočítajte si orientačné mesačné splátky. Skutočné podmienky sa môžu líšiť podľa bonity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Inputs */}
          <div className="lg:col-span-3 space-y-6">
            {/* Rate selection */}
            <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-6">
              <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-4">Typ financovania</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {rates.map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedRate(i)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      i === selectedRate
                        ? "border-[#ef4444]/50 bg-[#ef4444]/5"
                        : "border-white/5 hover:border-white/10"
                    }`}
                  >
                    <p className="font-semibold text-[#f0f2f5]">{r.name}</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-[#ef4444] to-[#f97316] bg-clip-text text-transparent mt-1">
                      {(r.rate * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-[#6b7a94] mt-1">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-6 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-[#94a3b8]">Cena vozidla</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-28 bg-[#060a12] border border-white/5 rounded-lg px-3 py-1.5 text-sm text-right text-[#f0f2f5] focus:border-[#ef4444]/50 focus:outline-none"
                    />
                    <span className="text-sm text-[#6b7a94]">€</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={3000}
                  max={100000}
                  step={500}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full accent-[#ef4444]"
                />
                <div className="flex justify-between text-xs text-[#6b7a94] mt-1">
                  <span>3 000 €</span>
                  <span>100 000 €</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-[#94a3b8]">Akontácia</label>
                  <span className="text-sm text-[#f0f2f5] font-medium">
                    {downPaymentPct}% ({downPayment.toLocaleString()} €)
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={80}
                  step={5}
                  value={downPaymentPct}
                  onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                  className="w-full accent-[#ef4444]"
                />
                <div className="flex justify-between text-xs text-[#6b7a94] mt-1">
                  <span>0%</span>
                  <span>80%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-[#94a3b8]">Doba splácania</label>
                  <span className="text-sm text-[#f0f2f5] font-medium">{months} mesiacov</span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={84}
                  step={6}
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full accent-[#ef4444]"
                />
                <div className="flex justify-between text-xs text-[#6b7a94] mt-1">
                  <span>12 mes.</span>
                  <span>84 mes.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-6 sticky top-24">
              <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-6">Váš výpočet</h3>

              <div className="text-center mb-6">
                <p className="text-sm text-[#6b7a94]">Mesačná splátka</p>
                <p className="text-5xl font-black bg-gradient-to-r from-[#ef4444] to-[#f97316] bg-clip-text text-transparent mt-2">
                  {Math.round(monthlyPayment).toLocaleString()} €
                </p>
                <p className="text-xs text-[#6b7a94] mt-2">
                  {rates[selectedRate].name} — {(rates[selectedRate].rate * 100).toFixed(1)}% p.a.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b7a94]">Cena vozidla</span>
                  <span className="text-[#f0f2f5] font-medium">{price.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b7a94]">Akontácia</span>
                  <span className="text-[#f0f2f5] font-medium">{downPayment.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b7a94]">Výška úveru</span>
                  <span className="text-[#f0f2f5] font-medium">{loanAmount.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b7a94]">Počet splátok</span>
                  <span className="text-[#f0f2f5] font-medium">{months}×</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-white/5">
                  <span className="text-[#6b7a94]">Zaplatíte celkom</span>
                  <span className="text-[#f0f2f5] font-semibold">{Math.round(totalPaid).toLocaleString()} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b7a94]">Úroky celkom</span>
                  <span className="text-[#f87171] font-semibold">{Math.round(totalInterest).toLocaleString()} €</span>
                </div>
              </div>

              <a
                href="/sk/kontakt"
                className="mt-6 w-full bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white font-semibold py-3 rounded-xl text-center block hover:-translate-y-0.5 transition-all shadow-[0_4px_20px_rgba(239,68,68,0.25)]"
              >
                Chcem financovanie
              </a>

              <p className="text-xs text-[#6b7a94] mt-4 text-center">
                * Orientačný výpočet. Skutočné podmienky záviseli od bonity klienta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
