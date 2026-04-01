import { Locale, getTranslations } from "@/lib/i18n";

interface Props {
  params: Promise<{ locale: string }>;
}

const content: Record<string, { title: string; blocks: { heading: string; text: string }[] }> = {
  sk: {
    title: "O nás",
    blocks: [
      {
        heading: "Kto sme",
        text: "KCars je rodinný autobazár s dlhoročnou tradíciou na slovenskom trhu. Špecializujeme sa na predaj kvalitných jazdených vozidiel za transparentné a férové ceny. Každé vozidlo v našej ponuke prechádza dôkladnou technickou kontrolou.",
      },
      {
        heading: "Naša filozofia",
        text: "Veríme, že kúpa auta nemá byť stresujúca. Preto kladieme dôraz na transparentnosť, čestné jednanie a maximálny komfort pre našich zákazníkov. U nás sa nemusíte báť skrytých vád ani nepríjemných prekvapení.",
      },
      {
        heading: "Čo ponúkame",
        text: "Široký výber overených vozidiel všetkých kategórií. Možnosť financovania na splátky. Kompletný servis pri prepise vozidla. Možnosť obhliadky a skúšobnej jazdy. Záruka na každé predané vozidlo.",
      },
      {
        heading: "Prečo práve my",
        text: "Stovky spokojných zákazníkov. Overené vozidlá s kompletnou históriou. Férové ceny bez skrytých poplatkov. Profesionálny prístup a poradenstvo pri výbere.",
      },
    ],
  },
  hu: {
    title: "Rólunk",
    blocks: [
      {
        heading: "Kik vagyunk",
        text: "A KCars egy családi autókereskedés hosszú hagyományokkal a szlovák piacon. Minőségi használt járművek értékesítésére specializálódtunk átlátható és tisztességes árakon. Kínálatunk minden járműve alapos műszaki ellenőrzésen esik át.",
      },
      {
        heading: "Filozófiánk",
        text: "Hisszük, hogy az autóvásárlásnak nem kell stresszesnek lennie. Ezért az átláthatóságra, a tisztességes üzletvitelre és az ügyfelek maximális kényelmére helyezzük a hangsúlyt.",
      },
      {
        heading: "Mit kínálunk",
        text: "Ellenőrzött járművek széles választéka minden kategóriában. Részletfizetési lehetőség. Teljes körű szolgáltatás az átíráshoz. Megtekintés és próbavezetés lehetősége. Garancia minden eladott járműre.",
      },
      {
        heading: "Miért minket válasszon",
        text: "Több száz elégedett ügyfél. Teljes előzménnyel rendelkező, ellenőrzött járművek. Rejtett díjak nélküli tisztességes árak. Szakmai hozzáállás és tanácsadás.",
      },
    ],
  },
  de: {
    title: "Über uns",
    blocks: [
      {
        heading: "Wer wir sind",
        text: "KCars ist ein familiengeführtes Autohaus mit langer Tradition auf dem slowakischen Markt. Wir sind auf den Verkauf hochwertiger Gebrauchtwagen zu transparenten und fairen Preisen spezialisiert. Jedes Fahrzeug in unserem Angebot wird einer gründlichen technischen Prüfung unterzogen.",
      },
      {
        heading: "Unsere Philosophie",
        text: "Wir glauben, dass der Autokauf nicht stressig sein muss. Deshalb legen wir Wert auf Transparenz, ehrliches Geschäftsgebaren und maximalen Komfort für unsere Kunden.",
      },
      {
        heading: "Was wir bieten",
        text: "Große Auswahl an geprüften Fahrzeugen aller Kategorien. Finanzierungsmöglichkeit. Kompletter Service bei der Umschreibung. Besichtigung und Probefahrt möglich. Garantie auf jedes verkaufte Fahrzeug.",
      },
      {
        heading: "Warum wir",
        text: "Hunderte zufriedene Kunden. Geprüfte Fahrzeuge mit vollständiger Historie. Faire Preise ohne versteckte Gebühren. Professionelle Beratung bei der Auswahl.",
      },
    ],
  },
  en: {
    title: "About Us",
    blocks: [
      {
        heading: "Who we are",
        text: "KCars is a family-owned car dealership with a long tradition in the Slovak market. We specialize in selling quality used vehicles at transparent and fair prices. Every vehicle in our offer undergoes a thorough technical inspection.",
      },
      {
        heading: "Our philosophy",
        text: "We believe that buying a car shouldn't be stressful. That's why we emphasize transparency, honest dealing, and maximum comfort for our customers. With us, you don't have to worry about hidden defects or unpleasant surprises.",
      },
      {
        heading: "What we offer",
        text: "Wide selection of verified vehicles in all categories. Financing options available. Complete service for vehicle transfer. Viewing and test drive available. Warranty on every vehicle sold.",
      },
      {
        heading: "Why choose us",
        text: "Hundreds of satisfied customers. Verified vehicles with complete history. Fair prices with no hidden fees. Professional approach and guidance in your selection.",
      },
    ],
  },
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  await getTranslations(locale as Locale);
  const c = content[locale] || content.sk;

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-12">
          {c.title}
        </h1>

        <div className="space-y-10">
          {c.blocks.map((block) => (
            <div key={block.heading}>
              <h2 className="text-xl font-semibold text-white mb-3">
                {block.heading}
              </h2>
              <p className="text-white/70 leading-relaxed">{block.text}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "500+", label: locale === "sk" ? "Predaných áut" : locale === "hu" ? "Eladott autó" : locale === "de" ? "Verkaufte Autos" : "Cars sold" },
            { value: "10+", label: locale === "sk" ? "Rokov skúseností" : locale === "hu" ? "Év tapasztalat" : locale === "de" ? "Jahre Erfahrung" : "Years experience" },
            { value: "98%", label: locale === "sk" ? "Spokojných zákazníkov" : locale === "hu" ? "Elégedett ügyfél" : locale === "de" ? "Zufriedene Kunden" : "Happy customers" },
            { value: "100%", label: locale === "sk" ? "Overené vozidlá" : locale === "hu" ? "Ellenőrzött jármű" : locale === "de" ? "Geprüfte Fahrzeuge" : "Verified vehicles" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-zinc-900 rounded-xl border border-white/10 p-6 text-center"
            >
              <p className="text-3xl font-bold text-red-500">{stat.value}</p>
              <p className="text-sm text-white/50 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
