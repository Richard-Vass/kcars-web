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
      <section className="py-20 bg-gradient-to-br from-red-600 to-red-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            {locale === "sk" && "Hľadáte konkrétne auto?"}
            {locale === "hu" && "Konkrét autót keres?"}
            {locale === "de" && "Suchen Sie ein bestimmtes Auto?"}
            {locale === "en" && "Looking for a specific car?"}
          </h2>
          <p className="mt-4 text-lg text-white/80">
            {locale === "sk" &&
              "Kontaktujte nás a pomôžeme vám nájsť to pravé vozidlo."}
            {locale === "hu" &&
              "Vegye fel velünk a kapcsolatot, segítünk megtalálni a megfelelő járművet."}
            {locale === "de" &&
              "Kontaktieren Sie uns und wir helfen Ihnen, das richtige Fahrzeug zu finden."}
            {locale === "en" &&
              "Contact us and we'll help you find the right vehicle."}
          </p>
          <a
            href={`/${locale}/kontakt`}
            className="mt-8 inline-block bg-white text-red-600 font-semibold px-8 py-4 rounded-lg text-lg hover:bg-white/90 transition-colors"
          >
            {t.nav.contact}
          </a>
        </div>
      </section>
    </>
  );
}
