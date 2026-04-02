import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Používanie cookies",
};

export default function CookiesPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-8">
        <h1 className="text-3xl font-bold text-[#f0f2f5] mb-8">Používanie cookies</h1>
        <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-8 space-y-6 text-[#94a3b8] leading-relaxed text-sm">
          <p>Táto webová stránka používa cookies k zlepšeniu používateľskej skúsenosti. Používaním tejto webovej stránky súhlasíte so všetkými súbormi cookie v súlade s našou politikou cookies.</p>
          <h2 className="text-lg font-semibold text-[#f0f2f5] pt-4">Čo sú cookies</h2>
          <p>Cookies sú malé textové súbory, ktoré sa ukladajú vo vašom prehliadači. Pomáhajú webovej stránke zapamätať si vaše preferencie a zlepšiť váš zážitok.</p>
          <h2 className="text-lg font-semibold text-[#f0f2f5] pt-4">Aké cookies používame</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong className="text-[#f0f2f5]">Nevyhnutné cookies</strong> — potrebné pre fungovanie stránky (jazyk, session)</li>
            <li><strong className="text-[#f0f2f5]">Analytické cookies</strong> — pomáhajú nám pochopiť ako používate stránku (Google Analytics)</li>
          </ul>
          <h2 className="text-lg font-semibold text-[#f0f2f5] pt-4">Ako spravovať cookies</h2>
          <p>Cookies môžete odmietnuť alebo vymazať v nastaveniach vášho prehliadača. Odmietnutie cookies môže obmedziť funkčnosť stránky.</p>
        </div>
      </div>
    </div>
  );
}
