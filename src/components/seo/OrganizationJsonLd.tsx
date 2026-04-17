import { companyInfo } from "@/lib/contact";

/**
 * Organization + AutoDealer JSON-LD — globálny schema pre Google o firme.
 * Vložiť do [locale]/layout.tsx (raz, nie na každú page).
 */
export default function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "AutoDealer"],
    name: companyInfo.name,
    legalName: companyInfo.name,
    url: "https://kcars.sk",
    logo: "https://kcars.sk/apple-touch-icon.png",
    image: "https://kcars.sk/apple-touch-icon.png",
    description:
      "Autobazár KCars — jazdené prémiové značky, overená história, financovanie od 0 %, výkup vozidiel.",
    telephone: companyInfo.phone,
    email: companyInfo.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: companyInfo.address,
      addressLocality: "Nový Život",
      postalCode: "930 38",
      addressCountry: "SK",
    },
    areaServed: ["SK", "HU", "CZ", "AT", "DE"],
    priceRange: "€€–€€€",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "13:00",
      },
    ],
    sameAs: [
      "https://www.facebook.com/kcars.sk",
      // Pridať ostatné sociálne siete po poskytnutí klientom
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
