import { Locale, getTranslations } from "@/lib/i18n";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCars from "@/components/home/FeaturedCars";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations(locale as Locale);

  return (
    <>
      <HeroSection locale={locale as Locale} t={t} />
      <FeaturedCars locale={locale as Locale} t={t} />

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#ef4444]/10 via-[#060a12] to-[#f97316]/10 border-y border-white/5">
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
          <a
            href={`/${locale}/kontakt`}
            className="mt-8 inline-block bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white font-semibold px-8 py-4 rounded-[20px] text-lg shadow-[0_4px_24px_rgba(239,68,68,0.3)] hover:shadow-[0_12px_36px_rgba(239,68,68,0.4)] hover:-translate-y-1 transition-all"
          >
            {t.nav.contact}
          </a>
        </div>
      </section>
    </>
  );
}
