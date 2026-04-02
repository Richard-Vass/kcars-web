import type { Metadata } from "next";
import { Locale, getTranslations } from "@/lib/i18n";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Komisný predaj — Predáme vaše auto",
  description: "Komisný predaj áut s províziou len 3%. Parkovné zdarma, bezplatná inzercia, čistenie vozidla, zabezpečenie STK. K cars autobazár Nový Život.",
};

interface Props {
  params: Promise<{ locale: string }>;
}

const content: Record<string, { title: string; intro: string; services: string[]; conditions: string[]; note: string }> = {
  sk: {
    title: "Komisný predaj",
    intro: "Ak potrebujete predať svoje auto, ale nepotrebujete peniaze ihneď v hotovosti a nechcete mať starosti s predajom auta, môžete využiť službu komisný predaj v našej spoločnosti. To znamená že Vaše auto predávate v našich autobazároch a peniaze dostanete až po predaji auta.\n\nPonúkame Vám naše služby s dlhoročnými skúsenosťami v oblasti predaja jazdených áut a výhodné možnosti financovania pre budúcich majiteľov.",
    services: [
      "Zariadime vám bezplatnú inzerciu v médiách",
      "Kompletné čistenie a leštenie karosérie",
      "Kompletné čistenie a tepovanie interiéru — alebo môžete využiť služby našich partnerských autoservisov na prípadné odstránenie vád a porúch",
      "Služby zabezpečenia STK a EK",
    ],
    conditions: [
      "Sprostredkovateľská provízia len 3% (vrátane DPH) z predajnej ceny auta minimálne však 100 €",
      "Parkovné Zdarma",
      "Široké možnosti financovania áut pre nových majiteľov",
      "Možný predaj auta oprávnenou treťou osobou",
      "Bezpečné parkovanie auta počas predaja v našich priestoroch",
      "Vysoká denná návštevnosť našich autobazárov",
      "Všetky autá sú ponúkané na webových stránkach",
      "Pravidelné umývanie áut na predajných plochách zadarmo",
    ],
    note: "Takto si môžete zvýšiť hodnotu svojho auta a tým vzbudiť väčší záujem kupujúcich.",
  },
  hu: {
    title: "Bizományosi értékesítés",
    intro: "Ha el szeretné adni autóját, de nem szükséges azonnali készpénz, és nem akar a vele járó gondokkal foglalkozni, igénybe veheti bizományosi értékesítési szolgáltatásunkat. Az autója a mi telephelyeinken kerül értékesítésre, és az eladás után kapja meg az összeget.",
    services: [
      "Ingyenes hirdetést biztosítunk a médiában",
      "Teljes karosszéria tisztítás és polírozás",
      "Teljes belső tér tisztítás és gőzölés",
      "STK és EK szolgáltatások biztosítása",
    ],
    conditions: [
      "Közvetítői jutalék mindössze 3% (ÁFA-val), minimum 100 €",
      "Ingyenes parkolás",
      "Széles finanszírozási lehetőségek",
      "Harmadik személy általi eladás lehetősége",
      "Biztonságos parkolás értékesítés alatt",
      "Magas napi látogatottság",
      "Minden autó megjelenik a weboldalon",
      "Rendszeres autómosás ingyenesen",
    ],
    note: "Így növelheti autója értékét és nagyobb érdeklődést kelthet a vásárlók körében.",
  },
  de: {
    title: "Kommissionsverkauf",
    intro: "Wenn Sie Ihr Auto verkaufen möchten, aber kein sofortiges Bargeld benötigen, können Sie unseren Kommissionsverkauf nutzen. Ihr Auto wird auf unseren Plätzen verkauft und Sie erhalten das Geld nach dem Verkauf.",
    services: [
      "Kostenlose Werbung in den Medien",
      "Komplette Karosseriereinigung und Politur",
      "Komplette Innenraumreinigung und Dampfreinigung",
      "TÜV- und Emissionsservice",
    ],
    conditions: [
      "Vermittlungsprovision nur 3% (inkl. MwSt.), mindestens 100 €",
      "Kostenloses Parken",
      "Breite Finanzierungsmöglichkeiten",
      "Verkauf durch bevollmächtigte Dritte möglich",
      "Sicheres Parken während des Verkaufs",
      "Hohe tägliche Besucherzahl",
      "Alle Autos auf der Website gelistet",
      "Regelmäßige kostenlose Autowäsche",
    ],
    note: "So können Sie den Wert Ihres Autos steigern und mehr Kaufinteresse wecken.",
  },
  en: {
    title: "Consignment Sale",
    intro: "If you need to sell your car but don't need immediate cash and don't want to deal with the hassle of selling, you can use our consignment sale service. Your car will be displayed at our dealerships and you'll receive payment after the sale.\n\nWe offer our services with years of experience in used car sales and attractive financing options for future owners.",
    services: [
      "Free advertising in media",
      "Complete body cleaning and polishing",
      "Complete interior cleaning and steam cleaning — or use our partner service centers for repairs",
      "MOT and emission check services",
    ],
    conditions: [
      "Commission only 3% (incl. VAT) of sale price, minimum 100 €",
      "Free parking",
      "Wide financing options for new owners",
      "Sale by authorized third party possible",
      "Secure parking during sale on our premises",
      "High daily visitor count at our dealerships",
      "All cars listed on our website",
      "Regular free car washing on display lots",
    ],
    note: "This way you can increase your car's value and attract more buyer interest.",
  },
};

export default async function KomisnyPredajPage({ params }: Props) {
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

        {/* Services */}
        <div className="bg-[#111a2e] rounded-2xl border border-white/5 p-8 mb-8">
          <h2 className="text-xl font-semibold text-[#f0f2f5] mb-6">
            {locale === "sk" ? "Čo pre vás urobíme" : locale === "hu" ? "Amit Önért teszünk" : locale === "de" ? "Was wir für Sie tun" : "What we do for you"}
          </h2>
          <ul className="space-y-3">
            {c.services.map((s) => (
              <li key={s} className="flex items-start gap-3">
                <div className="w-5 h-5 mt-0.5 bg-[#3b82f6]/10 border border-[#3b82f6]/30 rounded-md flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[#f0f2f5]">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Conditions */}
        <div className="bg-[#111a2e] rounded-2xl border border-white/5 p-8 mb-8">
          <h2 className="text-xl font-semibold text-[#f0f2f5] mb-6">
            {locale === "sk" ? "Podmienky komisného predaja" : locale === "hu" ? "Bizományi feltételek" : locale === "de" ? "Kommissionsbedingungen" : "Consignment conditions"}
          </h2>
          <ul className="space-y-3">
            {c.conditions.map((cond) => (
              <li key={cond} className="flex items-start gap-3">
                <div className="w-5 h-5 mt-0.5 bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-md flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[#f0f2f5]">{cond}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[#94a3b8] italic">{c.note}</p>
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
