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
      className="group bg-[#111a2e] rounded-[20px] overflow-hidden border border-white/5 hover:border-[#ef4444]/20 transition-all hover:shadow-xl hover:shadow-[#ef4444]/5"
    >
      <div className="aspect-[16/10] bg-[#0c1221] relative overflow-hidden">
        {car.images && car.images.length > 0 ? (
          <Image
            src={car.images[0]}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg className="w-16 h-16 text-[#1e293b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {car.status === "reserved" && (
          <div className="absolute top-3 right-3 bg-[#f97316] text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            {locale === "sk" ? "Rezervované" : locale === "hu" ? "Foglalt" : locale === "de" ? "Reserviert" : "Reserved"}
          </div>
        )}
        {car.status === "sold" && (
          <div className="absolute top-3 right-3 bg-[#ef4444] text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            {locale === "sk" ? "Predané" : locale === "hu" ? "Eladva" : locale === "de" ? "Verkauft" : "Sold"}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-[#6b7a94] uppercase tracking-wider font-medium">{car.brand}</p>
            <h3 className="text-lg font-semibold text-[#f0f2f5] mt-1 group-hover:text-[#f87171] transition-colors">
              {car.brand} {car.model}
            </h3>
          </div>
          <p className="text-xl font-bold bg-gradient-to-r from-[#ef4444] to-[#f97316] bg-clip-text text-transparent whitespace-nowrap">
            {car.price.toLocaleString()} {t.common.eur}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[#6b7a94]">
          <span>{car.year}</span>
          <span className="w-1 h-1 rounded-full bg-[#6b7a94]/30" />
          <span>{car.mileage.toLocaleString()} {t.common.km}</span>
          <span className="w-1 h-1 rounded-full bg-[#6b7a94]/30" />
          <span>{car.power_kw} {t.common.kw}</span>
          <span className="w-1 h-1 rounded-full bg-[#6b7a94]/30" />
          <span>{fuelLabels[car.fuel]?.[locale] || car.fuel}</span>
          <span className="w-1 h-1 rounded-full bg-[#6b7a94]/30" />
          <span>{transmissionLabels[car.transmission]?.[locale] || car.transmission}</span>
        </div>
      </div>
    </Link>
  );
}
