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
    <div className="bg-zinc-900 rounded-xl border border-white/10 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{t.cars.filter}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Brand */}
        <select
          value={searchParams.get("brand") || ""}
          onChange={(e) => updateFilter("brand", e.target.value)}
          className="bg-zinc-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
        >
          <option value="">{t.cars.allBrands}</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        {/* Fuel */}
        <select
          value={searchParams.get("fuel") || ""}
          onChange={(e) => updateFilter("fuel", e.target.value)}
          className="bg-zinc-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
        >
          <option value="">{t.cars.allFuels}</option>
          <option value="petrol">{t.cars.petrol}</option>
          <option value="diesel">{t.cars.diesel}</option>
          <option value="electric">{t.cars.electric}</option>
          <option value="hybrid">{t.cars.hybrid}</option>
        </select>

        {/* Transmission */}
        <select
          value={searchParams.get("transmission") || ""}
          onChange={(e) => updateFilter("transmission", e.target.value)}
          className="bg-zinc-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
        >
          <option value="">{t.cars.allTransmissions}</option>
          <option value="manual">{t.cars.manual}</option>
          <option value="automatic">{t.cars.automatic}</option>
        </select>

        {/* Price from */}
        <input
          type="number"
          placeholder={t.cars.priceFrom}
          value={searchParams.get("priceFrom") || ""}
          onChange={(e) => updateFilter("priceFrom", e.target.value)}
          className="bg-zinc-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
        />

        {/* Price to */}
        <input
          type="number"
          placeholder={t.cars.priceTo}
          value={searchParams.get("priceTo") || ""}
          onChange={(e) => updateFilter("priceTo", e.target.value)}
          className="bg-zinc-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
        />

        {/* Year from */}
        <input
          type="number"
          placeholder={t.cars.yearFrom}
          value={searchParams.get("yearFrom") || ""}
          onChange={(e) => updateFilter("yearFrom", e.target.value)}
          className="bg-zinc-800 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
        />
      </div>
    </div>
  );
}
