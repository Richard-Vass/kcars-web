import { Locale, getTranslations } from "@/lib/i18n";
import ContactForm from "@/components/forms/ContactForm";

interface Props {
  params: Promise<{ locale: string }>;
}

const info: Record<string, { hours: string[]; mapLabel: string }> = {
  sk: {
    hours: ["Pondelok – Piatok: 8:00 – 17:00", "Sobota: 9:00 – 13:00", "Nedeľa: Zatvorené"],
    mapLabel: "Kde nás nájdete",
  },
  hu: {
    hours: ["Hétfő – Péntek: 8:00 – 17:00", "Szombat: 9:00 – 13:00", "Vasárnap: Zárva"],
    mapLabel: "Hol talál minket",
  },
  de: {
    hours: ["Montag – Freitag: 8:00 – 17:00", "Samstag: 9:00 – 13:00", "Sonntag: Geschlossen"],
    mapLabel: "So finden Sie uns",
  },
  en: {
    hours: ["Monday – Friday: 8:00 – 17:00", "Saturday: 9:00 – 13:00", "Sunday: Closed"],
    mapLabel: "How to find us",
  },
};

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations(locale as Locale);
  const i = info[locale] || info.sk;

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-12">
          {t.contact.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Form */}
          <div>
            <ContactForm t={t} />
          </div>

          {/* Right: Info */}
          <div className="space-y-8">
            {/* Address */}
            <div className="bg-zinc-900 rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t.contact.address}
              </h3>
              <p className="text-white/70">KCars s.r.o.</p>
              <p className="text-white/50 text-sm mt-1">Adresa bude doplnená</p>
            </div>

            {/* Contact details */}
            <div className="bg-zinc-900 rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {t.contact.phone}
              </h3>
              <a href="tel:+421000000000" className="text-white/70 hover:text-red-500 transition-colors">
                +421 XXX XXX XXX
              </a>
              <br />
              <a href="mailto:info@kcars.sk" className="text-white/70 hover:text-red-500 transition-colors">
                info@kcars.sk
              </a>
            </div>

            {/* Opening hours */}
            <div className="bg-zinc-900 rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t.contact.hours}
              </h3>
              <ul className="space-y-1">
                {i.hours.map((h) => (
                  <li key={h} className="text-white/70 text-sm">{h}</li>
                ))}
              </ul>
            </div>

            {/* Map placeholder */}
            <div className="bg-zinc-900 rounded-xl border border-white/10 overflow-hidden">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  {i.mapLabel}
                </h3>
              </div>
              <div className="h-64 bg-zinc-800 flex items-center justify-center text-white/30">
                Google Maps — bude doplnená po zadaní adresy
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
