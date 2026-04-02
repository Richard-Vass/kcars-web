import type { Metadata } from "next";
import { Locale, getTranslations } from "@/lib/i18n";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Výkup vozidiel — Peniaze ihneď",
  description: "Vykúpime vaše auto za najvyššiu cenu na trhu. Peniaze ihneď v hotovosti, transparentné ocenenie, administratívu vybavíme za vás. K cars autobazár.",
};

interface Props {
  params: Promise<{ locale: string }>;
}

const content: Record<string, { title: string; intro: string; benefits: string[]; outro: string }> = {
  sk: {
    title: "Výkup vozidiel",
    intro: "Ponúkame transparentné ocenenie vášho auta, najvyššie možné ceny na trhu. Vykupujeme autá všetkých značiek a modelov vo všetkých cenových reláciách.\n\nZmluvná záruka na počet najazdených kilometrov, technický stav a pôvod vozidla. Možnosť overenia km cez VIN číslo. Kompletný servis len v AUTORIZOVANOM SERVISE. Pri kúpe vozidla u nás, môžete Vaše staré auto použiť ako finančnú protihodnotu.",
    benefits: [
      "Peniaze ihneď a v hotovosti",
      "Dostanete najvyššiu cenu na trhu",
      "Transparentné a férové ocenenie",
      "Administratívu vybavíme za vás",
      "Bonus pri výmene auta",
      "Doplatíme za vás leasing či úver",
      "Výhodný komisný predaj",
    ],
    outro: "Preberáme všetku administratívu a nepríjemnosti spojené s reklamáciami našich zákazníkov na seba. Pri výkupe vám pomôžeme so všetkou administratívou a právnymi a technickými formalitami.",
  },
  hu: {
    title: "Járművásárlás",
    intro: "Átlátható értékelést kínálunk autójáról, a piacon elérhető legmagasabb árakon. Minden márkájú és típusú autót felvásárolunk, minden árkategóriában.\n\nSzerződéses garancia a kilométeróra állására, a műszaki állapotra és a jármű eredetére. VIN-szám alapú km-ellenőrzés lehetősége.",
    benefits: [
      "Azonnali készpénzes fizetés",
      "A piacon elérhető legmagasabb ár",
      "Átlátható és tisztességes értékelés",
      "Az adminisztrációt mi intézzük",
      "Bónusz autócserénél",
      "Lízinget vagy hitelt kifizetjük Ön helyett",
      "Kedvező bizományosi értékesítés",
    ],
    outro: "Minden adminisztrációt és ügyfélreklamációt magunkra vállalunk.",
  },
  de: {
    title: "Fahrzeugankauf",
    intro: "Wir bieten eine transparente Bewertung Ihres Autos zu den höchstmöglichen Marktpreisen. Wir kaufen Autos aller Marken und Modelle in allen Preisklassen.\n\nVertragliche Garantie auf Kilometerstand, technischen Zustand und Fahrzeugherkunft. Möglichkeit der km-Überprüfung per VIN-Nummer.",
    benefits: [
      "Sofortige Barzahlung",
      "Höchstpreis auf dem Markt",
      "Transparente und faire Bewertung",
      "Wir erledigen die Verwaltung für Sie",
      "Bonus beim Fahrzeugtausch",
      "Wir zahlen Leasing oder Kredit für Sie ab",
      "Günstiger Kommissionsverkauf",
    ],
    outro: "Wir übernehmen die gesamte Verwaltung und alle Formalitäten für Sie.",
  },
  en: {
    title: "Vehicle Buyback",
    intro: "We offer transparent vehicle valuation at the highest possible market prices. We buy cars of all makes and models in all price ranges.\n\nContractual guarantee on mileage, technical condition, and vehicle origin. Option to verify km via VIN number. Complete service only at AUTHORIZED SERVICE centers.",
    benefits: [
      "Immediate cash payment",
      "Highest price on the market",
      "Transparent and fair valuation",
      "We handle all the paperwork",
      "Bonus for car exchange",
      "We pay off your leasing or loan",
      "Affordable consignment sale",
    ],
    outro: "We take care of all administration and formalities on your behalf.",
  },
};

export default async function VykupPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations(locale as Locale);
  const c = content[locale] || content.sk;

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-0.5 bg-gradient-to-r from-[#ef4444] to-[#f97316] rounded-full" />
          <span className="text-xs font-semibold uppercase tracking-[2px] text-[#f87171]">
            {locale === "sk" ? "Služby" : locale === "hu" ? "Szolgáltatások" : locale === "de" ? "Dienstleistungen" : "Services"}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-[#f0f2f5] mb-8" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
          {c.title}
        </h1>

        <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-8 mb-8">
          <p className="text-[#94a3b8] leading-relaxed whitespace-pre-line">{c.intro}</p>
        </div>

        <div className="bg-[#111a2e] rounded-2xl border border-white/5 p-8 mb-8">
          <h2 className="text-xl font-semibold text-[#f0f2f5] mb-6">
            {locale === "sk" ? "Výhody výkupu u nás" : locale === "hu" ? "Előnyeink" : locale === "de" ? "Unsere Vorteile" : "Our advantages"}
          </h2>
          <ul className="space-y-3">
            {c.benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <div className="w-5 h-5 mt-0.5 bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-md flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[#f0f2f5]">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-8 mb-8">
          <p className="text-[#94a3b8] leading-relaxed">{c.outro}</p>
        </div>

        <Link
          href={`/${locale}/kontakt`}
          className="inline-block bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white font-semibold px-8 py-4 rounded-[20px] shadow-[0_4px_24px_rgba(239,68,68,0.3)] hover:shadow-[0_12px_36px_rgba(239,68,68,0.4)] hover:-translate-y-1 transition-all"
        >
          {t.nav.contact}
        </Link>
      </div>
    </div>
  );
}
