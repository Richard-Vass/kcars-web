import { Locale, getTranslations } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import CarCard from "@/components/cars/CarCard";
import CarFilters from "@/components/cars/CarFilters";
import { Car } from "@/types";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function CarsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const filters = await searchParams;
  const t = await getTranslations(locale as Locale);

  // Build query
  let query = supabase
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.brand) query = query.eq("brand", filters.brand);
  if (filters.fuel) query = query.eq("fuel", filters.fuel);
  if (filters.transmission) query = query.eq("transmission", filters.transmission);
  if (filters.priceFrom) query = query.gte("price", Number(filters.priceFrom));
  if (filters.priceTo) query = query.lte("price", Number(filters.priceTo));
  if (filters.yearFrom) query = query.gte("year", Number(filters.yearFrom));

  const { data: cars } = await query;

  // Get unique brands for filter dropdown
  const { data: brandRows } = await supabase
    .from("cars")
    .select("brand")
    .order("brand");
  const brands = [...new Set(brandRows?.map((r) => r.brand) || [])];

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">
          {t.cars.title}
        </h1>

        <CarFilters locale={locale as Locale} t={t} brands={brands} />

        {cars && cars.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(cars as Car[]).map((car) => (
              <CarCard key={car.id} car={car} locale={locale as Locale} t={t} />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <svg className="w-16 h-16 text-zinc-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-white/50 text-lg">{t.cars.noResults}</p>
          </div>
        )}
      </div>
    </div>
  );
}
