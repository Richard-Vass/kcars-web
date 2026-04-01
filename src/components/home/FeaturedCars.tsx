import Link from "next/link";
import { Locale } from "@/lib/i18n";

interface FeaturedCarsProps {
  locale: Locale;
  t: {
    featured: { title: string; viewAll: string };
    cars: { mileage: string; year: string; power: string };
    common: { eur: string; km: string; kw: string };
  };
}

// Demo data — will be replaced with Supabase query
const demoCars = [
  {
    id: "1",
    slug: "skoda-octavia-2021",
    brand: "Škoda",
    model: "Octavia Combi",
    year: 2021,
    price: 18900,
    mileage: 65000,
    fuel: "diesel",
    power_kw: 110,
    images: [],
  },
  {
    id: "2",
    slug: "bmw-320d-2020",
    brand: "BMW",
    model: "320d xDrive",
    year: 2020,
    price: 28500,
    mileage: 82000,
    fuel: "diesel",
    power_kw: 140,
    images: [],
  },
  {
    id: "3",
    slug: "vw-golf-8-2022",
    brand: "Volkswagen",
    model: "Golf 8",
    year: 2022,
    price: 22300,
    mileage: 35000,
    fuel: "petrol",
    power_kw: 110,
    images: [],
  },
];

export default function FeaturedCars({ locale, t }: FeaturedCarsProps) {
  return (
    <section className="py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-white">{t.featured.title}</h2>
          <Link
            href={`/${locale}/ponuka`}
            className="text-red-500 hover:text-red-400 font-medium transition-colors"
          >
            {t.featured.viewAll} &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoCars.map((car) => (
            <Link
              key={car.id}
              href={`/${locale}/ponuka/${car.slug}`}
              className="group bg-zinc-900 rounded-xl overflow-hidden border border-white/5 hover:border-red-500/30 transition-all hover:shadow-xl hover:shadow-red-500/5"
            >
              {/* Image placeholder */}
              <div className="aspect-[16/10] bg-zinc-800 flex items-center justify-center">
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

              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">
                      {car.brand}
                    </p>
                    <h3 className="text-lg font-semibold text-white mt-1 group-hover:text-red-500 transition-colors">
                      {car.brand} {car.model}
                    </h3>
                  </div>
                  <p className="text-xl font-bold text-red-500">
                    {car.price.toLocaleString()} {t.common.eur}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm text-white/50">
                  <span>
                    {t.cars.year}: {car.year}
                  </span>
                  <span>
                    {car.mileage.toLocaleString()} {t.common.km}
                  </span>
                  <span>
                    {car.power_kw} {t.common.kw}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
