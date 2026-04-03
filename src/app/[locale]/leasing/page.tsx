"use client";

import { useState } from "react";

// VÚB Banka rate table — monthly rates derived from actual VÚB offer
// Rate varies by term length (shorter = higher rate)
const vubMonthlyRates: Record<number, number> = {
  12: 0.0160,
  18: 0.0158,
  24: 0.0155,
  30: 0.0153,
  36: 0.0150,
  42: 0.0148,
  48: 0.014618,  // VÚB: 571.07 at 19600/48
  54: 0.01420,
  60: 0.013780,  // VÚB: 482.24 at 19600/60
  66: 0.01350,
  72: 0.013248,  // VÚB: 424.06 at 19600/72
  78: 0.01305,
  84: 0.012879,  // VÚB: 383.24 at 19600/84
  90: 0.01275,
  96: 0.012620,  // VÚB: 353.37 at 19600/96
};

function getMonthlyRate(months: number, type: number): number {
  // Type 0 = Splátkový predaj (VÚB sadzba)
  // Type 1 = Leasing (nižšia sadzba ~75% VÚB)
  // Type 2 = Prefinancovanie (~90% VÚB)
  const multiplier = type === 0 ? 1.0 : type === 1 ? 0.75 : 0.90;

  // Find closest matching rate
  const keys = Object.keys(vubMonthlyRates).map(Number).sort((a, b) => a - b);
  let closest = keys[0];
  for (const k of keys) {
    if (Math.abs(k - months) < Math.abs(closest - months)) {
      closest = k;
    }
  }
  return vubMonthlyRates[closest] * multiplier;
}

const rateTypes = [
  { name: "Splátkový predaj", desc: "Úver cez VÚB Banku • Akontácia od 0%" },
  { name: "Leasing", desc: "Finančný leasing • Pre podnikateľov" },
  { name: "Prefinancovanie", desc: "Prefinancujte vaše auto • Hotovosť ihneď" },
];

export default function LeasingPage() {
  const [price, setPrice] = useState(24500);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [months, setMonths] = useState(48);
  const [selectedRate, setSelectedRate] = useState(0);

  const downPayment = Math.round(price * (downPaymentPct / 100));
  const loanAmount = price - downPayment;
  const monthlyRate = getMonthlyRate(months, selectedRate);
  const annualRate = monthlyRate * 12;

  const monthlyPayment =
    loanAmount > 0 && monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
      : 0;

  const totalPaid = monthlyPayment * months + downPayment;
  const totalInterest = totalPaid - price;
  const koeficient = price > 0 ? totalPaid / price : 0;

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
            Kalkulačka splátok
          </h1>
          <p className="text-[#94a3b8] mt-3 max-w-lg mx-auto">
            Vypočítajte si orientačné mesačné splátky. Schválenie úveru do 30 minút. Akontácia od 0%.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Inputs */}
          <div className="lg:col-span-3 space-y-6">
            {/* Rate selection */}
            <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-6">
              <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-4">Typ financovania</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {rateTypes.map((r, i) => (
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
                    <p className="text-xs text-[#8b9bb4] mt-2">{r.desc}</p>
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
                    <span className="text-sm text-[#8b9bb4]">€</span>
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
                <div className="flex justify-between text-xs text-[#8b9bb4] mt-1">
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
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-[#94a3b8]">Doba splácania</label>
                  <span className="text-sm text-[#f0f2f5] font-medium">{months} mesiacov</span>
                </div>
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
                  <span>12 mes.</span>
                  <span>96 mes.</span>
                </div>
              </div>
            </div>

            {/* Quick comparison table */}
            <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-6">
              <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-4">Porovnanie splátok</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left text-[#8b9bb4] font-medium py-2 pr-4">Akontácia</th>
                      {[10, 20, 30, 40, 50].map((pct) => (
                        <th key={pct} className="text-right text-[#8b9bb4] font-medium py-2 px-2">{pct}%</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-[#8b9bb4] py-2 pr-4">Výška úveru</td>
                      {[10, 20, 30, 40, 50].map((pct) => {
                        const loan = price - Math.round(price * pct / 100);
                        return <td key={pct} className="text-right text-[#f0f2f5] py-2 px-2">{loan.toLocaleString()} €</td>;
                      })}
                    </tr>
                    <tr className="border-t border-white/5">
                      <td className="text-[#8b9bb4] py-2 pr-4">Splátka / {months} mes.</td>
                      {[10, 20, 30, 40, 50].map((pct) => {
                        const loan = price - Math.round(price * pct / 100);
                        const r = getMonthlyRate(months, selectedRate);
                        const pmt = loan > 0 ? (loan * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1) : 0;
                        const isSelected = pct === downPaymentPct;
                        return (
                          <td key={pct} className={`text-right py-2 px-2 font-semibold ${isSelected ? "text-[#f87171]" : "text-[#f0f2f5]"}`}>
                            {Math.round(pmt).toLocaleString()} €
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-6 sticky top-24">
              <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-6">Váš výpočet</h3>

              <div className="text-center mb-6">
                <p className="text-sm text-[#8b9bb4]">Mesačná splátka</p>
                <p className="text-5xl font-black bg-gradient-to-r from-[#ef4444] to-[#f97316] bg-clip-text text-transparent mt-2">
                  {Math.round(monthlyPayment).toLocaleString()} €
                </p>
                <p className="text-xs text-[#8b9bb4] mt-2">
                  {rateTypes[selectedRate].name} • {months} mesiacov
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8b9bb4]">Cena vozidla</span>
                  <span className="text-[#f0f2f5] font-medium">{price.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8b9bb4]">Akontácia ({downPaymentPct}%)</span>
                  <span className="text-[#f0f2f5] font-medium">{downPayment.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8b9bb4]">Výška úveru</span>
                  <span className="text-[#f0f2f5] font-medium">{loanAmount.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8b9bb4]">Počet splátok</span>
                  <span className="text-[#f0f2f5] font-medium">{months}×</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-white/5">
                  <span className="text-[#8b9bb4]">Zaplatíte celkom</span>
                  <span className="text-[#f0f2f5] font-semibold">{Math.round(totalPaid).toLocaleString()} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8b9bb4]">Koeficient navýšenia</span>
                  <span className="text-[#f0f2f5] font-semibold">{koeficient.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8b9bb4]">Úroky celkom</span>
                  <span className="text-[#f87171] font-semibold">{Math.round(totalInterest).toLocaleString()} €</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="mt-6 pt-4 border-t border-white/5 space-y-2">
                {[
                  "Schválenie do 30 minút",
                  "Bez obmedzenia rokom výroby",
                  "Ihneď sa stávate majiteľom",
                  "Odchádzate s plne poisteným autom",
                ].map((b) => (
                  <div key={b} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#22c55e]/10 border border-[#22c55e]/30 rounded flex items-center justify-center flex-shrink-0">
                      <svg className="w-2.5 h-2.5 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs text-[#8b9bb4]">{b}</span>
                  </div>
                ))}
              </div>

              <a
                href="/sk/kontakt"
                className="mt-6 w-full bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white font-semibold py-3 rounded-xl text-center block hover:-translate-y-0.5 transition-all shadow-[0_4px_20px_rgba(239,68,68,0.25)]"
              >
                Chcem financovanie
              </a>

              <p className="text-xs text-[#8b9bb4] mt-4 text-center">
                * Orientačný výpočet. Skutočné podmienky závisia od bonity klienta.
              </p>
            </div>
          </div>
        </div>
        {/* Detailed conditions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Splátkový predaj */}
          <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-6">
            <div className="w-10 h-10 bg-[#ef4444]/10 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-[#f87171]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#f0f2f5] mb-3">Splátkový predaj</h3>
            <ul className="space-y-2 text-sm text-[#8b9bb4]">
              <li className="flex items-start gap-2">
                <span className="text-[#22c55e] mt-0.5">✓</span>
                Akontácia od 0% — nemusíte platiť nič vopred
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22c55e] mt-0.5">✓</span>
                Doba splácania 12 – 96 mesiacov
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22c55e] mt-0.5">✓</span>
                Schválenie úveru do 30 minút
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22c55e] mt-0.5">✓</span>
                Bez obmedzenia rokom výroby vozidla
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22c55e] mt-0.5">✓</span>
                Ihneď sa stávate majiteľom vozidla
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22c55e] mt-0.5">✓</span>
                Splátky prispôsobíme vášmu rozpočtu
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22c55e] mt-0.5">✓</span>
                Možnosť predčasného splatenia bez poplatkov
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22c55e] mt-0.5">✓</span>
                Administratívny poplatok: 0 €
              </li>
            </ul>
          </div>

          {/* Leasing */}
          <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-6">
            <div className="w-10 h-10 bg-[#3b82f6]/10 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#f0f2f5] mb-3">Finančný leasing</h3>
            <ul className="space-y-2 text-sm text-[#8b9bb4]">
              <li className="flex items-start gap-2">
                <span className="text-[#60a5fa] mt-0.5">✓</span>
                Akontácia od 0% — jednoduchý a rýchly spôsob
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#60a5fa] mt-0.5">✓</span>
                Doba splácania až 84 mesiacov
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#60a5fa] mt-0.5">✓</span>
                Možnosť predčasného ukončenia zmluvy
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#60a5fa] mt-0.5">✓</span>
                Vhodné pre podnikateľov — daňovo odpočítateľné
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#60a5fa] mt-0.5">✓</span>
                Bez nutnosti zálohy na účte
              </li>
            </ul>
          </div>

          {/* Prefinancovanie */}
          <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-6">
            <div className="w-10 h-10 bg-[#f97316]/10 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-[#fb923c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#f0f2f5] mb-3">Prefinancovanie</h3>
            <ul className="space-y-2 text-sm text-[#8b9bb4]">
              <li className="flex items-start gap-2">
                <span className="text-[#fb923c] mt-0.5">✓</span>
                Prefinancujte si vlastné auto — získajte hotovosť
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#fb923c] mt-0.5">✓</span>
                Auto zostáva vám, dostanete potrebnú hotovosť
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#fb923c] mt-0.5">✓</span>
                Vaše auto využívate naďalej bez obmedzenia
              </li>
            </ul>
          </div>

          {/* Poistenie */}
          <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-6">
            <div className="w-10 h-10 bg-[#22c55e]/10 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#f0f2f5] mb-3">Poistenie</h3>
            <ul className="space-y-2 text-sm text-[#8b9bb4]">
              <li className="flex items-start gap-2">
                <span className="text-[#4ade80] mt-0.5">✓</span>
                Havarijné poistenie — poškodenie, krádež, živelná udalosť
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4ade80] mt-0.5">✓</span>
                PZP so 60% vstupným cenovým bonusom
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4ade80] mt-0.5">✓</span>
                Vstupný bonus až do 70%
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4ade80] mt-0.5">✓</span>
                Odchádzate s plne poisteným autom
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-[#94a3b8] mb-6">
            Máte otázky ohľadom financovania? Radi vám poradíme.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/sk/kontakt"
              className="bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white font-semibold px-8 py-4 rounded-[20px] shadow-[0_4px_24px_rgba(239,68,68,0.3)] hover:-translate-y-1 transition-all"
            >
              Kontaktujte nás
            </a>
            <a
              href="https://wa.me/421905489662?text=Dobrý%20deň,%20mám%20záujem%20o%20financovanie%20vozidla."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white font-semibold px-8 py-4 rounded-[20px] shadow-[0_4px_24px_rgba(37,211,102,0.3)] hover:-translate-y-1 transition-all inline-flex items-center gap-2"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
