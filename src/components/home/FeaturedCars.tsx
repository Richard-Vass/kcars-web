import Link from "next/link";
import Image from "next/image";
import { Locale } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { Car } from "@/types";
import { proxyImageUrl } from "@/lib/utils";

interface FeaturedCarsProps {
  locale: Locale;
  t: {
    featured: { title: string; viewAll: string };
    cars: { mileage: string; year: string; power: string };
    common: { eur: string; km: string; kw: string };
  };
}

export default async function FeaturedCars({ locale, t }: FeaturedCarsProps) {
  const { data } = await supabase
    .from("cars")
    .select("*")
    .eq("featured", true)
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(3);

  const cars = (data || []) as Car[];

  return (
    <section className="py-24 bg-[#0c1221]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-0.5 bg-gradient-to-r from-[#ef4444] to-[#f97316] rounded-full" />
              <span className="text-xs font-semibold uppercase tracking-[2px] text-[#f87171]">
                {locale === "sk" ? "Výber" : locale === "hu" ? "Válogatás" : locale === "de" ? "Auswahl" : "Selection"}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-[#f0f2f5]" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
              {t.featured.title}
            </h2>
          </div>
          <Link
            href={`/${locale}/ponuka`}
            className="text-[#f87171] hover:text-[#ef4444] font-medium transition-colors flex items-center gap-1"
          >
            {t.featured.viewAll}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Link
              key={car.id}
              href={`/${locale}/ponuka/${car.slug}`}
              className="group bg-[#111a2e] rounded-[20px] overflow-hidden border border-white/5 hover:border-[#ef4444]/20 transition-all hover:shadow-xl hover:shadow-[#ef4444]/5"
            >
              <div className="aspect-[16/10] bg-[#0c1221] relative overflow-hidden">
                {car.images && car.images.length > 0 ? (
                  <Image
                    src={proxyImageUrl(car.images[0])}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <svg className="w-16 h-16 text-[#1e293b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-[#8b9bb4] uppercase tracking-wider font-medium">
                      {car.brand}
                    </p>
                    <h3 className="text-lg font-semibold text-[#f0f2f5] mt-1 group-hover:text-[#f87171] transition-colors">
                      {car.brand} {car.model}
                    </h3>
                  </div>
                  <p className="text-xl font-bold bg-gradient-to-r from-[#ef4444] to-[#f97316] bg-clip-text text-transparent whitespace-nowrap">
                    {car.price.toLocaleString()} {t.common.eur}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm text-[#8b9bb4]">
                  <span>{t.cars.year}: {car.year}</span>
                  <span>{car.mileage.toLocaleString()} {t.common.km}</span>
                  <span>{car.power_kw} {t.common.kw}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
