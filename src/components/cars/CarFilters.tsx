"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Locale } from "@/lib/i18n";

interface CarFiltersProps {
  locale: Locale;
  t: {
    cars: {
      filter: string;
      brand: string;
      priceFrom: string;
      priceTo: string;
      yearFrom: string;
      fuel: string;
      transmission: string;
      allBrands: string;
      allFuels: string;
      allTransmissions: string;
      petrol: string;
      diesel: string;
      electric: string;
      hybrid: string;
      manual: string;
      automatic: string;
    };
  };
  brands: string[];
  bodyTypes: string[];
}

const inputClass = "bg-[#0c1221] border border-white/5 rounded-xl px-4 py-3 text-sm text-[#f0f2f5] placeholder:text-[#6b7a94] focus:border-[#ef4444]/50 focus:outline-none transition-colors";

const bodyTypeLabels: Record<string, Record<string, string>> = {
  sedan: { sk: "Sedan", hu: "Szedán", de: "Limousine", en: "Sedan" },
  kombi: { sk: "Kombi", hu: "Kombi", de: "Kombi", en: "Estate" },
  SUV: { sk: "SUV", hu: "SUV", de: "SUV", en: "SUV" },
  hatchback: { sk: "Hatchback", hu: "Hatchback", de: "Schrägheck", en: "Hatchback" },
  kabriolet: { sk: "Kabriolet", hu: "Kabrió", de: "Cabrio", en: "Convertible" },
  van: { sk: "Van", hu: "Furgon", de: "Van", en: "Van" },
  minibus: { sk: "Minibus", hu: "Minibusz", de: "Minibus", en: "Minibus" },
  skúter: { sk: "Skúter", hu: "Robogó", de: "Roller", en: "Scooter" },
  disky: { sk: "Disky/Pneumatiky", hu: "Felnik", de: "Felgen", en: "Wheels/Tires" },
  nákladné: { sk: "Nákladné", hu: "Teherautó", de: "LKW", en: "Truck" },
  náves: { sk: "Náves", hu: "Pótkocsi", de: "Anhänger", en: "Trailer" },
};

export default function CarFilters({ locale, t, brands, bodyTypes }: CarFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/${locale}/ponuka?${params.toString()}`);
    },
    [router, searchParams, locale]
  );

  const clearFilters = useCallback(() => {
    router.push(`/${locale}/ponuka`);
  }, [router, locale]);

  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className="bg-[#111a2e] rounded-[20px] border border-white/5 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#f0f2f5]">{t.cars.filter}</h3>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-[#f87171] hover:text-[#ef4444] transition-colors flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {locale === "sk" ? "Zrušiť filtre" : locale === "hu" ? "Szűrők törlése" : locale === "de" ? "Filter löschen" : "Clear filters"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Brand */}
        <select value={searchParams.get("brand") || ""} onChange={(e) => updateFilter("brand", e.target.value)} className={inputClass}>
          <option value="">{t.cars.allBrands}</option>
          {brands.map((b) => (<option key={b} value={b}>{b}</option>))}
        </select>

        {/* Body type */}
        <select value={searchParams.get("bodyType") || ""} onChange={(e) => updateFilter("bodyType", e.target.value)} className={inputClass}>
          <option value="">{locale === "sk" ? "Všetky karosérie" : locale === "hu" ? "Minden karosszéria" : locale === "de" ? "Alle Karosserien" : "All body types"}</option>
          {bodyTypes.map((bt) => (
            <option key={bt} value={bt}>{bodyTypeLabels[bt]?.[locale] || bt}</option>
          ))}
        </select>

        {/* Fuel */}
        <select value={searchParams.get("fuel") || ""} onChange={(e) => updateFilter("fuel", e.target.value)} className={inputClass}>
          <option value="">{t.cars.allFuels}</option>
          <option value="petrol">{t.cars.petrol}</option>
          <option value="diesel">{t.cars.diesel}</option>
          <option value="electric">{t.cars.electric}</option>
          <option value="hybrid">{t.cars.hybrid}</option>
        </select>

        {/* Transmission */}
        <select value={searchParams.get("transmission") || ""} onChange={(e) => updateFilter("transmission", e.target.value)} className={inputClass}>
          <option value="">{t.cars.allTransmissions}</option>
          <option value="manual">{t.cars.manual}</option>
          <option value="automatic">{t.cars.automatic}</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Price from */}
        <input type="number" placeholder={t.cars.priceFrom} value={searchParams.get("priceFrom") || ""} onChange={(e) => updateFilter("priceFrom", e.target.value)} className={inputClass} />

        {/* Price to */}
        <input type="number" placeholder={t.cars.priceTo} value={searchParams.get("priceTo") || ""} onChange={(e) => updateFilter("priceTo", e.target.value)} className={inputClass} />

        {/* Year from */}
        <input type="number" placeholder={t.cars.yearFrom} value={searchParams.get("yearFrom") || ""} onChange={(e) => updateFilter("yearFrom", e.target.value)} className={inputClass} />

        {/* Sort */}
        <select value={searchParams.get("sort") || ""} onChange={(e) => updateFilter("sort", e.target.value)} className={inputClass}>
          <option value="">{locale === "sk" ? "Zoradiť: Najnovšie" : locale === "hu" ? "Rendezés: Legújabb" : locale === "de" ? "Sortieren: Neueste" : "Sort: Newest"}</option>
          <option value="price_asc">{locale === "sk" ? "Cena: Najlacnejšie" : locale === "hu" ? "Ár: Legolcsóbb" : locale === "de" ? "Preis: Aufsteigend" : "Price: Low to High"}</option>
          <option value="price_desc">{locale === "sk" ? "Cena: Najdrahšie" : locale === "hu" ? "Ár: Legdrágább" : locale === "de" ? "Preis: Absteigend" : "Price: High to Low"}</option>
          <option value="year_desc">{locale === "sk" ? "Rok: Najnovšie" : locale === "hu" ? "Év: Legújabb" : locale === "de" ? "Jahr: Neueste" : "Year: Newest"}</option>
          <option value="year_asc">{locale === "sk" ? "Rok: Najstaršie" : locale === "hu" ? "Év: Legrégebbi" : locale === "de" ? "Jahr: Älteste" : "Year: Oldest"}</option>
          <option value="mileage_asc">{locale === "sk" ? "Km: Najmenej" : locale === "hu" ? "Km: Legkevesebb" : locale === "de" ? "Km: Niedrigste" : "Mileage: Lowest"}</option>
          <option value="mileage_desc">{locale === "sk" ? "Km: Najviac" : locale === "hu" ? "Km: Legtöbb" : locale === "de" ? "Km: Höchste" : "Mileage: Highest"}</option>
        </select>
      </div>
    </div>
  );
}
