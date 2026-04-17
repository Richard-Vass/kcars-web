import { Locale } from "@/lib/i18n";

interface Badge {
  icon: React.ReactNode;
  title: Record<string, string>;
  desc: Record<string, string>;
}

// inline SVG ikony — jednoduchý stroke style, kompatibilné s celym UI
const IconWrap = ({ children }: { children: React.ReactNode }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-7 h-7"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const badges: Badge[] = [
  {
    icon: (
      <IconWrap>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </IconWrap>
    ),
    title: {
      sk: "Overená história",
      cs: "Ověřená historie",
      hu: "Ellenőrzött előélet",
      de: "Geprüfte Historie",
      en: "Verified history",
    },
    desc: {
      sk: "Carfax / VIN check na každom aute, bez výnimky.",
      cs: "Carfax / VIN check na každém autě, bez výjimky.",
      hu: "Carfax / VIN ellenőrzés minden autón.",
      de: "Carfax / VIN-Check bei jedem Auto — ohne Ausnahme.",
      en: "Carfax / VIN check on every car, without exception.",
    },
  },
  {
    icon: (
      <IconWrap>
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M6 12h.01M18 12h.01" />
      </IconWrap>
    ),
    title: {
      sk: "Financovanie od 0 %",
      cs: "Financování od 0 %",
      hu: "0%-tól finanszírozás",
      de: "Finanzierung ab 0 %",
      en: "Financing from 0%",
    },
    desc: {
      sk: "Spolupracujeme s viacerými bankami — vyberieme najlepšiu ponuku.",
      cs: "Spolupracujeme s více bankami — vybereme nejlepší nabídku.",
      hu: "Több bankkal dolgozunk — a legjobb ajánlatot választjuk.",
      de: "Wir arbeiten mit mehreren Banken — wählen das beste Angebot.",
      en: "We work with multiple banks — we'll pick the best offer.",
    },
  },
  {
    icon: (
      <IconWrap>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </IconWrap>
    ),
    title: {
      sk: "Technická kontrola",
      cs: "Technická kontrola",
      hu: "Műszaki ellenőrzés",
      de: "Technische Prüfung",
      en: "Technical inspection",
    },
    desc: {
      sk: "Pred predajom prejde každé auto 67-bodovou kontrolou.",
      cs: "Před prodejem prochází každé auto 67-bodovou kontrolou.",
      hu: "Eladás előtt minden autó 67 pontos ellenőrzésen megy át.",
      de: "Vor dem Verkauf jedes Auto 67-Punkte-Prüfung.",
      en: "Before sale, each car passes a 67-point inspection.",
    },
  },
  {
    icon: (
      <IconWrap>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </IconWrap>
    ),
    title: {
      sk: "Rezervácia do 24h",
      cs: "Rezervace do 24h",
      hu: "Foglalás 24 órán belül",
      de: "Reservierung innerhalb 24h",
      en: "Booking within 24h",
    },
    desc: {
      sk: "Potvrdíme termín obhliadky do 24 hodín od rezervácie.",
      cs: "Potvrdíme termín do 24 hodin od rezervace.",
      hu: "A foglalástól számított 24 órán belül visszaigazolunk.",
      de: "Wir bestätigen den Termin innerhalb 24h.",
      en: "We confirm your viewing appointment within 24h.",
    },
  },
  {
    icon: (
      <IconWrap>
        <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" />
        <circle cx="6.5" cy="16.5" r="2.5" />
        <circle cx="16.5" cy="16.5" r="2.5" />
      </IconWrap>
    ),
    title: {
      sk: "Výkup vozidiel",
      cs: "Výkup vozidel",
      hu: "Gépjármű-felvásárlás",
      de: "Fahrzeugankauf",
      en: "Vehicle buyout",
    },
    desc: {
      sk: "Vykúpime alebo vezmeme na protiúčet. Nezáväzná ponuka do 48h.",
      cs: "Vykupujeme nebo bereme na protiúčet. Nezávazná nabídka do 48h.",
      hu: "Felvásárlás vagy beszámítás — kötelezettség nélküli ajánlat 48 órán belül.",
      de: "Ankauf oder Inzahlungnahme — unverbindliches Angebot in 48h.",
      en: "Buyout or trade-in. Non-binding offer within 48h.",
    },
  },
  {
    icon: (
      <IconWrap>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </IconWrap>
    ),
    title: {
      sk: "Osobná konzultácia",
      cs: "Osobní konzultace",
      hu: "Személyes konzultáció",
      de: "Persönliche Beratung",
      en: "Personal consultation",
    },
    desc: {
      sk: "Poradíme pri výbere, financovaní aj prevode. Volajte kedykoľvek.",
      cs: "Poradíme s výběrem, financováním i převodem. Volejte kdykoliv.",
      hu: "Segítünk a választásban, finanszírozásban, átírásban.",
      de: "Wir beraten bei Auswahl, Finanzierung und Übertragung.",
      en: "We advise on selection, financing and transfer. Call anytime.",
    },
  },
];

interface Props {
  locale: Locale;
}

export default function TrustBadges({ locale }: Props) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {badges.map((b, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-6 bg-[#0c1221] border border-white/5 rounded-2xl hover:border-white/10 transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ef4444]/20 to-[#f97316]/20 flex items-center justify-center text-[#f87171] mb-4">
                {b.icon}
              </div>
              <h3 className="text-[#f0f2f5] font-semibold mb-2">
                {b.title[locale] || b.title.en}
              </h3>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                {b.desc[locale] || b.desc.en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
