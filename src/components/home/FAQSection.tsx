import { Locale } from "@/lib/i18n";

interface FAQ {
  q: string;
  a: string;
}

const faqs: Record<string, FAQ[]> = {
  sk: [
    {
      q: "Aké autá predávate?",
      a: "Špecializujeme sa na jazdené prémiové značky — Audi, BMW, Mercedes, Škoda, VW, Tesla a ďalšie. Všetky vozidlá prechádzajú technickou kontrolou a majú overenú históriu.",
    },
    {
      q: "Môžem si auto rezervovať online?",
      a: "Áno. Každé vozidlo v ponuke má tlačidlo „Rezervovať" — vyplníte kontaktné údaje a preferovaný dátum obhliadky. Do 24 hodín sa vám ozveme s potvrdením.",
    },
    {
      q: "Ponúkate financovanie?",
      a: "Spolupracujeme s viacerými bankami a lízingovými spoločnosťami. Kalkulačku splátok nájdete priamo pri detaile každého auta. Možná akontácia od 0 %.",
    },
    {
      q: "Vykúpite moje staré auto?",
      a: "Áno, vykupujeme jazdené autá alebo ich berieme na protiúčet. Pošlite nám fotky a základné info cez formulár „Výkup vozidiel" a do 48 hodín dostanete nezáväznú ponuku.",
    },
    {
      q: "Je cena konečná?",
      a: "Uvedená cena je konečná — bez skrytých poplatkov. Pripadne k tomu len prípadné náklady na prevod v DI (STK, prepis), ktoré sú oficiálne stanovené.",
    },
    {
      q: "Dám si auto vyskúšať?",
      a: "Samozrejme. Pri rezervácii označte „Testovacia jazda" a pripravíme vám vozidlo na obhliadku aj s možnosťou skúšky v bezpečnej lokalite.",
    },
  ],
  cs: [
    { q: "Jaká auta prodáváte?", a: "Specializujeme se na prémiové jeté značky — Audi, BMW, Mercedes, Škoda, VW, Tesla. Všechna vozidla prochází technickou kontrolou." },
    { q: "Mohu si auto rezervovat online?", a: "Ano. Každé vozidlo má tlačítko „Rezervovat" — vyplníte údaje a preferovaný termín, do 24h se ozveme." },
    { q: "Nabízíte financování?", a: "Ano, spolupracujeme s více bankami a leasingovými společnostmi. Kalkulačka splátek přímo u detailu auta." },
    { q: "Vykoupíte mé auto?", a: "Ano, vykupujeme jetá auta nebo je bereme na protiúčet. Pošlete fotky cez formulář a do 48h dostanete nabídku." },
    { q: "Je cena konečná?", a: "Ano, uvedená cena je konečná — bez skrytých poplatků." },
    { q: "Mohu si auto vyzkoušet?", a: "Samozřejmě — označte „Testovací jízda" při rezervaci." },
  ],
  hu: [
    { q: "Milyen autókat árulnak?", a: "Prémium használt márkákra specializálódtunk — Audi, BMW, Mercedes, Škoda, VW, Tesla. Minden autó átmegy műszaki ellenőrzésen." },
    { q: "Lefoglalhatom online?", a: "Igen. Minden járműnél van „Foglalás" gomb — kitölti az adatait, 24 órán belül jelentkezünk." },
    { q: "Kínálnak finanszírozást?", a: "Igen, több bankkal és lízingcéggel dolgozunk. Részletkalkulátor közvetlenül az autó adatlapján." },
    { q: "Megveszik az autómat?", a: "Igen, használt autókat felvásárolunk vagy beszámítunk. Küldjön képeket és 48 órán belül kap ajánlatot." },
    { q: "Az ár végleges?", a: "Igen, a feltüntetett ár végleges — nincsenek rejtett díjak." },
    { q: "Kipróbálhatom az autót?", a: "Persze — jelölje be a „Próbavezetés"-t a foglaláskor." },
  ],
  de: [
    { q: "Welche Autos verkaufen Sie?", a: "Wir sind auf gebrauchte Premium-Marken spezialisiert — Audi, BMW, Mercedes, Škoda, VW, Tesla. Alle Fahrzeuge bestehen eine technische Prüfung." },
    { q: "Kann ich online reservieren?", a: "Ja. Jedes Fahrzeug hat einen „Reservieren"-Button — Sie geben Ihre Daten und den bevorzugten Termin ein, innerhalb von 24 h melden wir uns." },
    { q: "Bieten Sie Finanzierung?", a: "Ja, wir arbeiten mit mehreren Banken und Leasinggesellschaften. Ratenrechner direkt beim Fahrzeug." },
    { q: "Kaufen Sie mein Auto?", a: "Ja, wir kaufen Gebrauchtwagen oder nehmen sie in Zahlung. Senden Sie Fotos und in 48 h erhalten Sie ein Angebot." },
    { q: "Ist der Preis endgültig?", a: "Ja, der angegebene Preis ist final — ohne versteckte Gebühren." },
    { q: "Kann ich Probefahrt machen?", a: "Natürlich — markieren Sie „Probefahrt" bei der Reservierung." },
  ],
  en: [
    { q: "What cars do you sell?", a: "We specialise in used premium brands — Audi, BMW, Mercedes, Škoda, VW, Tesla. All vehicles undergo technical inspection and have verified history." },
    { q: "Can I reserve a car online?", a: "Yes. Each vehicle has a „Reserve" button — fill in contact details and preferred viewing date. We respond within 24 hours." },
    { q: "Do you offer financing?", a: "Yes, we work with multiple banks and leasing companies. A payment calculator is available on every car detail page. Down payment from 0%." },
    { q: "Will you buy my car?", a: "Yes, we buy used cars or accept them as trade-in. Send photos via the „Vehicle Buyout" form and you'll receive a non-binding offer within 48 hours." },
    { q: "Is the price final?", a: "Yes, the listed price is final — without hidden fees. Only official registration costs (technical inspection, re-registration) may apply." },
    { q: "Can I test-drive the car?", a: "Of course. When making a reservation, tick „Test drive" and we'll prepare the vehicle in a safe test location." },
  ],
};

const titles: Record<string, string> = {
  sk: "Často kladené otázky",
  cs: "Často kladené otázky",
  hu: "Gyakran feltett kérdések",
  de: "Häufig gestellte Fragen",
  en: "Frequently asked questions",
};

interface Props {
  locale: Locale;
}

export default function FAQSection({ locale }: Props) {
  const items = faqs[locale] || faqs.en;
  const title = titles[locale] || titles.en;

  // JSON-LD FAQPage schema — perfektné pre Google rich results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <section className="py-20 px-4 bg-[#060a12]" aria-labelledby="faq-title">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto">
        <h2
          id="faq-title"
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#f0f2f5]"
        >
          {title}
        </h2>

        <div className="space-y-4">
          {items.map((item, i) => (
            <details
              key={i}
              className="group bg-[#0c1221] border border-white/5 rounded-2xl overflow-hidden transition-all hover:border-white/10"
            >
              <summary className="flex items-center justify-between cursor-pointer px-6 py-5 list-none">
                <h3 className="text-base md:text-lg font-semibold text-[#f0f2f5] pr-4">
                  {item.q}
                </h3>
                <svg
                  className="w-5 h-5 text-[#f87171] flex-shrink-0 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="px-6 pb-5 text-[#94a3b8] text-sm md:text-base leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
