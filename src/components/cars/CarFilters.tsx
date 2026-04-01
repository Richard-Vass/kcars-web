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
}

const inputClass = "bg-[#0c1221] border border-white/5 rounded-xl px-4 py-3 text-sm text-[#f0f2f5] placeholder:text-[#6b7a94] focus:border-[#ef4444]/50 focus:outline-none transition-colors";

export default function CarFilters({ locale, t, brands }: CarFiltersProps) {
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

  return (
    <div className="bg-[#111a2e] rounded-[20px] border border-white/5 p-6">
      <h3 className="text-lg font-semibold text-[#f0f2f5] mb-4">{t.cars.filter}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <select value={searchParams.get("brand") || ""} onChange={(e) => updateFilter("brand", e.target.value)} className={inputClass}>
          <option value="">{t.cars.allBrands}</option>
          {brands.map((b) => (<option key={b} value={b}>{b}</option>))}
        </select>
        <select value={searchParams.get("fuel") || ""} onChange={(e) => updateFilter("fuel", e.target.value)} className={inputClass}>
          <option value="">{t.cars.allFuels}</option>
          <option value="petrol">{t.cars.petrol}</option>
          <option value="diesel">{t.cars.diesel}</option>
          <option value="electric">{t.cars.electric}</option>
          <option value="hybrid">{t.cars.hybrid}</option>
        </select>
        <select value={searchParams.get("transmission") || ""} onChange={(e) => updateFilter("transmission", e.target.value)} className={inputClass}>
          <option value="">{t.cars.allTransmissions}</option>
          <option value="manual">{t.cars.manual}</option>
          <option value="automatic">{t.cars.automatic}</option>
        </select>
        <input type="number" placeholder={t.cars.priceFrom} value={searchParams.get("priceFrom") || ""} onChange={(e) => updateFilter("priceFrom", e.target.value)} className={inputClass} />
        <input type="number" placeholder={t.cars.priceTo} value={searchParams.get("priceTo") || ""} onChange={(e) => updateFilter("priceTo", e.target.value)} className={inputClass} />
        <input type="number" placeholder={t.cars.yearFrom} value={searchParams.get("yearFrom") || ""} onChange={(e) => updateFilter("yearFrom", e.target.value)} className={inputClass} />
      </div>
    </div>
  );
}
