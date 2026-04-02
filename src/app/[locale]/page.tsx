import { Locale, getTranslations } from "@/lib/i18n";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCars from "@/components/home/FeaturedCars";
import Link from "next/link";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations(locale as Locale);

  const services = [
    {
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      title: locale === "sk" ? "Overené vozidlá" : locale === "hu" ? "Ellenőrzött járművek" : locale === "de" ? "Geprüfte Fahrzeuge" : "Verified Vehicles",
      desc: locale === "sk" ? "Každé auto prechádza technickou kontrolou" : locale === "hu" ? "Minden autó műszaki ellenőrzésen megy át" : locale === "de" ? "Jedes Auto wird technisch geprüft" : "Every car undergoes technical inspection",
    },
    {
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      title: locale === "sk" ? "Férové ceny" : locale === "hu" ? "Tisztességes árak" : locale === "de" ? "Faire Preise" : "Fair Prices",
      desc: locale === "sk" ? "Žiadne skryté poplatky, transparentné ceny" : locale === "hu" ? "Nincsenek rejtett díjak" : locale === "de" ? "Keine versteckten Gebühren" : "No hidden fees, transparent pricing",
    },
    {
      icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
      title: locale === "sk" ? "Financovanie" : locale === "hu" ? "Finanszírozás" : locale === "de" ? "Finanzierung" : "Financing",
      desc: locale === "sk" ? "Splátkový predaj, leasing, akontácia od 0%" : locale === "hu" ? "Részletfizetés, lízing, 0% előleg" : locale === "de" ? "Ratenzahlung, Leasing, 0% Anzahlung" : "Installments, leasing, 0% down payment",
    },
    {
      icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
      title: locale === "sk" ? "Výkup a výmena" : locale === "hu" ? "Felvásárlás és csere" : locale === "de" ? "Ankauf und Tausch" : "Buyback & Trade-in",
      desc: locale === "sk" ? "Vykúpime vaše auto alebo ho vezmeme na protiúčet" : locale === "hu" ? "Megvesszük autóját vagy beszámítjuk" : locale === "de" ? "Wir kaufen Ihr Auto oder nehmen es in Zahlung" : "We buy your car or take it as trade-in",
    },
  ];

  return (
    <>
      <HeroSection locale={locale as Locale} t={t} />
      <FeaturedCars locale={locale as Locale} t={t} />

      {/* Services Section */}
      <section className="py-20 bg-[#060a12]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center gap-3 justify-center mb-3">
              <div className="w-8 h-0.5 bg-gradient-to-r from-[#ef4444] to-[#f97316] rounded-full" />
              <span className="text-xs font-semibold uppercase tracking-[2px] text-[#f87171]">
                {locale === "sk" ? "Naše služby" : locale === "hu" ? "Szolgáltatásaink" : locale === "de" ? "Unsere Dienste" : "Our Services"}
              </span>
              <div className="w-8 h-0.5 bg-gradient-to-r from-[#f97316] to-[#ef4444] rounded-full" />
            </div>
            <h2 className="text-3xl font-bold text-[#f0f2f5]" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
              {locale === "sk" ? "Prečo K cars?" : locale === "hu" ? "Miért K cars?" : locale === "de" ? "Warum K cars?" : "Why K cars?"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <div key={s.title} className="bg-[#0c1221] rounded-2xl border border-white/5 p-6 hover:border-[#ef4444]/20 transition-all group">
                <div className="w-12 h-12 bg-[#ef4444]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#ef4444]/20 transition-colors">
                  <svg className="w-6 h-6 text-[#f87171]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#f0f2f5] mb-2">{s.title}</h3>
                <p className="text-sm text-[#8b9bb4]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#0c1221] border-y border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "500+", label: locale === "sk" ? "Predaných áut" : locale === "hu" ? "Eladott autó" : locale === "de" ? "Verkaufte Autos" : "Cars sold" },
              { value: "12+", label: locale === "sk" ? "Rokov skúseností" : locale === "hu" ? "Év tapasztalat" : locale === "de" ? "Jahre Erfahrung" : "Years experience" },
              { value: "60+", label: locale === "sk" ? "Áut v ponuke" : locale === "hu" ? "Autó kínálatban" : locale === "de" ? "Autos im Angebot" : "Cars available" },
              { value: "98%", label: locale === "sk" ? "Spokojných zákazníkov" : locale === "hu" ? "Elégedett ügyfél" : locale === "de" ? "Zufriedene Kunden" : "Happy customers" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-black bg-gradient-to-r from-[#ef4444] to-[#f97316] bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-[#8b9bb4] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#ef4444]/10 via-[#060a12] to-[#f97316]/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#f0f2f5]" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
            {locale === "sk" && "Hľadáte konkrétne auto?"}
            {locale === "hu" && "Konkrét autót keres?"}
            {locale === "de" && "Suchen Sie ein bestimmtes Auto?"}
            {locale === "en" && "Looking for a specific car?"}
          </h2>
          <p className="mt-4 text-lg text-[#94a3b8]">
            {locale === "sk" && "Kontaktujte nás a pomôžeme vám nájsť to pravé vozidlo."}
            {locale === "hu" && "Vegye fel velünk a kapcsolatot, segítünk megtalálni a megfelelő járművet."}
            {locale === "de" && "Kontaktieren Sie uns und wir helfen Ihnen, das richtige Fahrzeug zu finden."}
            {locale === "en" && "Contact us and we'll help you find the right vehicle."}
          </p>
          <div className="mt-8 flex gap-4 justify-center flex-wrap">
            <Link
              href={`/${locale}/kontakt`}
              className="bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white font-semibold px-8 py-4 rounded-[20px] text-lg shadow-[0_4px_24px_rgba(239,68,68,0.3)] hover:shadow-[0_12px_36px_rgba(239,68,68,0.4)] hover:-translate-y-1 transition-all"
            >
              {t.nav.contact}
            </Link>
            <a
              href="https://wa.me/421905489662"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white font-semibold px-8 py-4 rounded-[20px] text-lg shadow-[0_4px_24px_rgba(37,211,102,0.3)] hover:shadow-[0_12px_36px_rgba(37,211,102,0.4)] hover:-translate-y-1 transition-all inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
