import { Car } from "@/types";
import { companyInfo } from "@/lib/contact";

interface CarJsonLdProps {
  car: Car;
}

export default function CarJsonLd({ car }: CarJsonLdProps) {
  const fuelMap: Record<string, string> = {
    petrol: "https://schema.org/Gasoline",
    diesel: "https://schema.org/Diesel",
    electric: "https://schema.org/Electric",
    hybrid: "https://schema.org/HybridElectric",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${car.brand} ${car.model}`,
    brand: { "@type": "Brand", name: car.brand },
    model: car.model,
    vehicleModelDate: String(car.year),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: car.mileage,
      unitCode: "KMT",
    },
    fuelType: fuelMap[car.fuel] || car.fuel,
    vehicleTransmission: car.transmission === "automatic" ? "AutomaticTransmission" : "ManualTransmission",
    vehicleEngine: {
      "@type": "EngineSpecification",
      enginePower: {
        "@type": "QuantitativeValue",
        value: car.power_kw,
        unitCode: "KWT",
      },
    },
    color: car.color || undefined,
    numberOfDoors: car.doors || undefined,
    vehicleIdentificationNumber: car.vin || undefined,
    image: car.images?.[0] || undefined,
    offers: {
      "@type": "Offer",
      price: car.price,
      priceCurrency: "EUR",
      availability: car.status === "available"
        ? "https://schema.org/InStock"
        : car.status === "reserved"
        ? "https://schema.org/LimitedAvailability"
        : "https://schema.org/SoldOut",
      seller: {
        "@type": "AutoDealer",
        name: companyInfo.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: companyInfo.address,
          addressLocality: "Nový Život",
          postalCode: "930 38",
          addressCountry: "SK",
        },
        telephone: companyInfo.phone,
        email: companyInfo.email,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
