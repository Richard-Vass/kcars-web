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
    .select("*");

  if (filters.brand) query = query.eq("brand", filters.brand);
  if (filters.fuel) query = query.eq("fuel", filters.fuel);
  if (filters.transmission) query = query.eq("transmission", filters.transmission);
  if (filters.bodyType) query = query.eq("body_type", filters.bodyType);
  if (filters.priceFrom) query = query.gte("price", Number(filters.priceFrom));
  if (filters.priceTo) query = query.lte("price", Number(filters.priceTo));
  if (filters.yearFrom) query = query.gte("year", Number(filters.yearFrom));

  // Sorting
  const sort = filters.sort || "";
  if (sort === "price_asc") {
    query = query.order("price", { ascending: true });
  } else if (sort === "price_desc") {
    query = query.order("price", { ascending: false });
  } else if (sort === "year_desc") {
    query = query.order("year", { ascending: false });
  } else if (sort === "year_asc") {
    query = query.order("year", { ascending: true });
  } else if (sort === "mileage_asc") {
    query = query.order("mileage", { ascending: true });
  } else if (sort === "mileage_desc") {
    query = query.order("mileage", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data: cars } = await query;

  // Get unique brands for filter
  const { data: brandRows } = await supabase
    .from("cars")
    .select("brand")
    .order("brand");
  const brands = [...new Set(brandRows?.map((r) => r.brand) || [])];

  // Get unique body types for filter
  const { data: bodyRows } = await supabase
    .from("cars")
    .select("body_type")
    .not("body_type", "is", null)
    .order("body_type");
  const bodyTypes = [...new Set(bodyRows?.map((r) => r.body_type).filter(Boolean) || [])];

  const totalCount = cars?.length || 0;

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#f0f2f5]" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
              {locale === "sk" ? "Ponuka vozidiel" : locale === "hu" ? "Autókínálat" : locale === "de" ? "Fahrzeugangebot" : "Car Listings"}
            </h1>
            <p className="text-[#6b7a94] text-sm mt-1">
              {totalCount} {locale === "sk" ? "vozidiel" : locale === "hu" ? "jármű" : locale === "de" ? "Fahrzeuge" : "vehicles"}
            </p>
          </div>
        </div>

        <CarFilters locale={locale as Locale} t={t} brands={brands} bodyTypes={bodyTypes} />

        {cars && cars.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(cars as Car[]).map((car) => (
              <CarCard key={car.id} car={car} locale={locale as Locale} t={t} />
            ))}
          </div>
        ) : (
          <div className="mt-16 text-center">
            <svg className="w-16 h-16 text-[#1e293b] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-[#6b7a94] text-lg">{t.cars.noResults}</p>
          </div>
        )}
      </div>
    </div>
  );
}
