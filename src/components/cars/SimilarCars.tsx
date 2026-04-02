import Link from "next/link";
import { Car } from "@/types";
import { Locale } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { proxyImageUrl } from "@/lib/utils";

interface SimilarCarsProps {
  currentCar: Car;
  locale: Locale;
}

export default async function SimilarCars({ currentCar, locale }: SimilarCarsProps) {
  // Find similar cars by brand or price range
  const { data } = await supabase
    .from("cars")
    .select("*")
    .neq("id", currentCar.id)
    .neq("body_type", "doplnky")
    .eq("status", "available")
    .or(`brand.eq.${currentCar.brand},and(price.gte.${currentCar.price * 0.7},price.lte.${currentCar.price * 1.3})`)
    .limit(3);

  const cars = (data || []) as Car[];

  if (cars.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold text-[#f0f2f5] mb-6">
        {locale === "sk" ? "Podobné vozidlá" : locale === "hu" ? "Hasonló járművek" : locale === "de" ? "Ähnliche Fahrzeuge" : "Similar Vehicles"}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cars.map((car) => (
          <Link
            key={car.id}
            href={`/${locale}/ponuka/${car.slug}`}
            className="group bg-[#111a2e] rounded-xl overflow-hidden border border-white/5 hover:border-[#ef4444]/20 transition-all"
          >
            <div className="aspect-[16/10] bg-[#0c1221] relative overflow-hidden">
              {car.images && car.images.length > 0 ? (
                <img
                  src={proxyImageUrl(car.images[0])}
                  alt={`${car.brand} ${car.model}`}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <svg className="w-10 h-10 text-[#1e293b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold text-[#f0f2f5] group-hover:text-[#f87171] transition-colors">
                {car.brand} {car.model}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-[#8b9bb4]">{car.year} • {car.mileage.toLocaleString()} km</span>
                <span className="text-sm font-bold bg-gradient-to-r from-[#ef4444] to-[#f97316] bg-clip-text text-transparent">
                  {car.price.toLocaleString()} €
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
