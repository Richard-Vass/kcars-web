import Link from "next/link";
import Image from "next/image";
import { Car } from "@/types";
import { Locale } from "@/lib/i18n";

interface CarCardProps {
  car: Car;
  locale: Locale;
  t: {
    cars: { mileage: string; year: string; power: string };
    common: { eur: string; km: string; kw: string };
  };
}

export default function CarCard({ car, locale, t }: CarCardProps) {
  const fuelLabels: Record<string, Record<string, string>> = {
    petrol: { sk: "Benzín", hu: "Benzin", de: "Benzin", en: "Petrol" },
    diesel: { sk: "Diesel", hu: "Dízel", de: "Diesel", en: "Diesel" },
    electric: { sk: "Elektro", hu: "Elektromos", de: "Elektro", en: "Electric" },
    hybrid: { sk: "Hybrid", hu: "Hibrid", de: "Hybrid", en: "Hybrid" },
  };

  const transmissionLabels: Record<string, Record<string, string>> = {
    manual: { sk: "Manuál", hu: "Manuális", de: "Schaltung", en: "Manual" },
    automatic: { sk: "Automat", hu: "Automata", de: "Automatik", en: "Auto" },
  };

  return (
    <Link
      href={`/${locale}/ponuka/${car.slug}`}
      className="group bg-zinc-900 rounded-xl overflow-hidden border border-white/5 hover:border-red-500/30 transition-all hover:shadow-xl hover:shadow-red-500/5"
    >
      {/* Image */}
      <div className="aspect-[16/10] bg-zinc-800 relative overflow-hidden">
        {car.images && car.images.length > 0 ? (
          <Image
            src={car.images[0]}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg
              className="w-16 h-16 text-zinc-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Status badge */}
        {car.status === "reserved" && (
          <div className="absolute top-3 right-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
            {locale === "sk" ? "Rezervované" : locale === "hu" ? "Foglalt" : locale === "de" ? "Reserviert" : "Reserved"}
          </div>
        )}
        {car.status === "sold" && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            {locale === "sk" ? "Predané" : locale === "hu" ? "Eladva" : locale === "de" ? "Verkauft" : "Sold"}
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider">
              {car.brand}
            </p>
            <h3 className="text-lg font-semibold text-white mt-1 group-hover:text-red-500 transition-colors">
              {car.brand} {car.model}
            </h3>
          </div>
          <p className="text-xl font-bold text-red-500 whitespace-nowrap">
            {car.price.toLocaleString()} {t.common.eur}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/50">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {car.year}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {car.mileage.toLocaleString()} {t.common.km}
          </span>
          <span>{car.power_kw} {t.common.kw}</span>
          <span>{fuelLabels[car.fuel]?.[locale] || car.fuel}</span>
          <span>{transmissionLabels[car.transmission]?.[locale] || car.transmission}</span>
        </div>
      </div>
    </Link>
  );
}
