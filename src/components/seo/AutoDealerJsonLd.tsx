/**
 * AutoDealer structured data (Schema.org).
 * Pouzitie na hlavnej stranke a /ponuka routes.
 */

interface Props {
  locale: string;
  url?: string;
  name?: string;
}

export default function AutoDealerJsonLd({
  locale,
  url = "https://kcars.example.sk",
  name = "KCars",
}: Props) {
  const data = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": `${url}#autodealer`,
    name,
    url,
    description:
      locale === "sk"
        ? "Predaj jazdených vozidiel — kvalitné auta preverené, financovanie na mieste."
        : locale === "hu"
        ? "Használtautó-kereskedés — ellenőrzött autók, finanszírozás."
        : locale === "de"
        ? "Gebrauchtwagenhandel — geprüfte Autos, Finanzierung vor Ort."
        : "Used car dealership — quality vetted vehicles, on-site financing.",
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      addressCountry: "SK",
    },
    areaServed: [
      { "@type": "Country", name: "Slovakia" },
      { "@type": "Country", name: "Hungary" },
      { "@type": "Country", name: "Austria" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "14:00",
      },
    ],
    makesOffer: {
      "@type": "OfferCatalog",
      name: locale === "sk" ? "Jazdené vozidlá" : "Used vehicles",
    },
    paymentAccepted: ["Cash", "Bank Transfer", "Financing", "Leasing"],
    sameAs: [
      // Social linky doplnime ked bude CRM napojene
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
