import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Car } from "@/types";
import { Locale } from "@/lib/i18n";
import { proxyImageUrl } from "@/lib/utils";

interface RecentlySoldProps {
  locale: Locale;
}

export default async function RecentlySold({ locale }: RecentlySoldProps) {
  const { data } = await supabase
    .from("cars")
    .select("*")
    .eq("status", "sold")
    .neq("body_type", "doplnky")
    .order("updated_at", { ascending: false })
    .limit(4);

  const cars = (data || []) as Car[];

  if (cars.length === 0) return null;

  return (
    <section className="py-16 bg-[#060a12]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-0.5 bg-gradient-to-r from-[#ef4444] to-[#f97316] rounded-full" />
          <h2 className="text-xl font-semibold text-[#f0f2f5]">
            {locale === "sk" ? "Nedávno predané" : locale === "cs" ? "Nedávno prodáno" : locale === "hu" ? "Nemrég eladva" : locale === "de" ? "Kürzlich verkauft" : "Recently Sold"}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cars.map((car) => (
            <div key={car.id} className="bg-[#0c1221] rounded-xl overflow-hidden border border-white/5 opacity-60">
              <div className="aspect-[16/10] bg-[#111a2e] relative overflow-hidden">
                {car.images && car.images.length > 0 ? (
                  <Image
                    src={proxyImageUrl(car.images[0])}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover grayscale"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <svg className="w-10 h-10 text-[#1e293b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-[#ef4444] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {locale === "sk" ? "PREDANÉ" : locale === "cs" ? "PRODÁNO" : locale === "hu" ? "ELADVA" : locale === "de" ? "VERKAUFT" : "SOLD"}
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-[#8b9bb4]">{car.brand} {car.model}</p>
                <p className="text-xs text-[#6b7a94] mt-0.5">{car.year} • {car.mileage?.toLocaleString()} km</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
