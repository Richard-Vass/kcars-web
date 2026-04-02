import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Locale, getTranslations } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { Car } from "@/types";
import { proxyImageUrl } from "@/lib/utils";
import CarGallery from "@/components/cars/CarGallery";
import PaymentCalculator from "@/components/cars/PaymentCalculator";
import ReservationForm from "@/components/forms/ReservationForm";
import ShareButtons from "@/components/cars/ShareButtons";
import SimilarCars from "@/components/cars/SimilarCars";
import CarJsonLd from "@/components/seo/CarJsonLd";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await supabase.from("cars").select("*").eq("slug", slug).single();
  if (!data) return { title: "Auto nenájdené" };
  const car = data as Car;
  return {
    title: `${car.brand} ${car.model} ${car.year} — ${car.price.toLocaleString()} €`,
    description: `${car.brand} ${car.model}, rok ${car.year}, ${car.mileage.toLocaleString()} km, ${car.power_kw} kW, ${car.fuel}. Cena: ${car.price.toLocaleString()} €. K cars autobazár Nový Život.`,
    openGraph: {
      title: `${car.brand} ${car.model} ${car.year} — ${car.price.toLocaleString()} €`,
      description: `${car.brand} ${car.model}, ${car.mileage.toLocaleString()} km, ${car.power_kw} kW`,
      images: car.images?.[0] ? [{ url: car.images[0] }] : [],
    },
  };
}

export default async function CarDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations(locale as Locale);

  const { data } = await supabase
    .from("cars")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!data) notFound();

  const car = data as Car;
  const carUrl = `https://kcars.sk/${locale}/ponuka/${car.slug}`;

  const descriptionKey = `description_${locale}` as keyof Car;
  const description = (car[descriptionKey] as string) || car.description_sk || "";

  const fuelLabels: Record<string, Record<string, string>> = {
    petrol: { sk: "Benzín", hu: "Benzin", de: "Benzin", en: "Petrol" },
    diesel: { sk: "Diesel", hu: "Dízel", de: "Diesel", en: "Diesel" },
    electric: { sk: "Elektro", hu: "Elektromos", de: "Elektro", en: "Electric" },
    hybrid: { sk: "Hybrid", hu: "Hibrid", de: "Hybrid", en: "Hybrid" },
  };

  const transmissionLabels: Record<string, Record<string, string>> = {
    manual: { sk: "Manuál", hu: "Manuális", de: "Schaltgetriebe", en: "Manual" },
    automatic: { sk: "Automat", hu: "Automata", de: "Automatik", en: "Automatic" },
  };

  const specs = [
    { label: t.cars.year, value: car.year },
    { label: t.cars.mileage, value: `${car.mileage.toLocaleString()} ${t.common.km}` },
    { label: t.cars.power, value: `${car.power_kw} ${t.common.kw} (${Math.round(car.power_kw * 1.36)} HP)` },
    { label: t.cars.fuel, value: fuelLabels[car.fuel]?.[locale] || car.fuel },
    { label: t.cars.transmission, value: transmissionLabels[car.transmission]?.[locale] || car.transmission },
    ...(car.engine_capacity ? [{ label: locale === "sk" ? "Motor" : locale === "hu" ? "Motor" : locale === "de" ? "Motor" : "Engine", value: `${(car.engine_capacity / 1000).toFixed(1)} L` }] : []),
    ...(car.color ? [{ label: locale === "sk" ? "Farba" : locale === "hu" ? "Szín" : locale === "de" ? "Farbe" : "Color", value: car.color }] : []),
    ...(car.body_type ? [{ label: locale === "sk" ? "Karoséria" : locale === "hu" ? "Karosszéria" : locale === "de" ? "Karosserie" : "Body", value: car.body_type }] : []),
    ...(car.doors ? [{ label: locale === "sk" ? "Dvere" : locale === "hu" ? "Ajtók" : locale === "de" ? "Türen" : "Doors", value: car.doors }] : []),
  ];

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-[#8b9bb4]">
          <Link href={`/${locale}`} className="hover:text-white transition-colors">
            {t.nav.home}
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/ponuka`} className="hover:text-white transition-colors">
            {t.nav.cars}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#94a3b8]">{car.brand} {car.model}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Gallery + Specs */}
          <div className="lg:col-span-2 space-y-6">
            <CarGallery images={car.images || []} alt={`${car.brand} ${car.model}`} />

            {/* Title + Price (mobile) */}
            <div className="lg:hidden">
              <h1 className="text-3xl font-bold text-white">
                {car.brand} {car.model}
              </h1>
              <p className="text-3xl font-bold bg-gradient-to-r from-[#ef4444] to-[#f97316] bg-clip-text text-transparent mt-2">
                {car.price.toLocaleString()} {t.common.eur}
              </p>
            </div>

            {/* Specs */}
            <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {locale === "sk" ? "Parametre" : locale === "hu" ? "Paraméterek" : locale === "de" ? "Technische Daten" : "Specifications"}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {specs.map((spec) => (
                  <div key={spec.label}>
                    <p className="text-xs text-[#8b9bb4] uppercase tracking-wider">{spec.label}</p>
                    <p className="text-white font-medium mt-1">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {description && (
              <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  {locale === "sk" ? "Popis" : locale === "hu" ? "Leírás" : locale === "de" ? "Beschreibung" : "Description"}
                </h3>
                <p className="text-[#94a3b8] leading-relaxed whitespace-pre-line">{description}</p>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Title + Price (desktop) */}
            <div className="hidden lg:block">
              <h1 className="text-3xl font-bold text-white">
                {car.brand} {car.model}
              </h1>
              <p className="text-3xl font-bold bg-gradient-to-r from-[#ef4444] to-[#f97316] bg-clip-text text-transparent mt-2">
                {car.price.toLocaleString()} {t.common.eur}
              </p>
              {car.status !== "available" && (
                <span className={`inline-block mt-2 text-sm font-bold px-3 py-1 rounded ${
                  car.status === "reserved" ? "bg-yellow-500 text-black" : "bg-red-600 text-white"
                }`}>
                  {car.status === "reserved"
                    ? (locale === "sk" ? "Rezervované" : locale === "hu" ? "Foglalt" : locale === "de" ? "Reserviert" : "Reserved")
                    : (locale === "sk" ? "Predané" : locale === "hu" ? "Eladva" : locale === "de" ? "Verkauft" : "Sold")}
                </span>
              )}
            </div>

            {car.status === "available" && (
              <ReservationForm carId={car.id} t={t} />
            )}

            <PaymentCalculator price={car.price} t={t} />

            {/* Share */}
            <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-4">
              <ShareButtons url={carUrl} title={`${car.brand} ${car.model} — ${car.price.toLocaleString()} €`} />
            </div>
          </div>
        </div>

        {/* Similar cars */}
        <SimilarCars currentCar={car} locale={locale as Locale} />
      </div>

      {/* JSON-LD */}
      <CarJsonLd car={car} />
    </div>
  );
}
