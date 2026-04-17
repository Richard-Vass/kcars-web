import { Locale } from "@/lib/i18n";
import { ShieldCheck, Banknote, Wrench, Clock, Car as CarIcon, Phone } from "lucide-react";

interface Badge {
  icon: React.ReactNode;
  title: Record<string, string>;
  desc: Record<string, string>;
}

const badges: Badge[] = [
  {
    icon: <ShieldCheck className="w-7 h-7" />,
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
    icon: <Banknote className="w-7 h-7" />,
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
    icon: <Wrench className="w-7 h-7" />,
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
    icon: <Clock className="w-7 h-7" />,
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
    icon: <CarIcon className="w-7 h-7" />,
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
    icon: <Phone className="w-7 h-7" />,
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
