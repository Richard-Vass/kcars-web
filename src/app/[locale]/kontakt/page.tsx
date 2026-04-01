import { Locale, getTranslations } from "@/lib/i18n";
import ContactForm from "@/components/forms/ContactForm";
import { companyInfo } from "@/lib/contact";

interface Props {
  params: Promise<{ locale: string }>;
}

const info: Record<string, { hours: string[]; mapLabel: string; gdpr: string }> = {
  sk: {
    hours: ["Pondelok – Piatok: 8:00 – 17:00", "Sobota: 9:00 – 13:00", "Nedeľa: Zatvorené"],
    mapLabel: "Kde nás nájdete",
    gdpr: "Oboznámil som sa s ochranou osobných údajov.",
  },
  hu: {
    hours: ["Hétfő – Péntek: 8:00 – 17:00", "Szombat: 9:00 – 13:00", "Vasárnap: Zárva"],
    mapLabel: "Hol talál minket",
    gdpr: "Megismertem az adatvédelmi szabályzatot.",
  },
  de: {
    hours: ["Montag – Freitag: 8:00 – 17:00", "Samstag: 9:00 – 13:00", "Sonntag: Geschlossen"],
    mapLabel: "So finden Sie uns",
    gdpr: "Ich habe die Datenschutzrichtlinie gelesen.",
  },
  en: {
    hours: ["Monday – Friday: 8:00 – 17:00", "Saturday: 9:00 – 13:00", "Sunday: Closed"],
    mapLabel: "How to find us",
    gdpr: "I have read the privacy policy.",
  },
};

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations(locale as Locale);
  const i = info[locale] || info.sk;

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#f0f2f5] mb-12" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
          {t.contact.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Form */}
          <div>
            <ContactForm t={t} />
          </div>

          {/* Right: Info */}
          <div className="space-y-6">
            {/* Company info */}
            <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-6">
              <h3 className="text-lg font-semibold text-[#f0f2f5] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {companyInfo.name}
              </h3>
              <div className="space-y-1 text-sm text-[#94a3b8]">
                <p>{companyInfo.address}</p>
                <p>{companyInfo.city}</p>
                <p className="mt-2">IČO: {companyInfo.ico}</p>
                <p className="text-xs text-[#6b7a94] mt-1">{companyInfo.court}</p>
              </div>
            </div>

            {/* Contact details */}
            <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-6">
              <h3 className="text-lg font-semibold text-[#f0f2f5] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {t.contact.phone}
              </h3>
              <a href={`tel:${companyInfo.phone}`} className="text-[#f0f2f5] hover:text-[#f87171] transition-colors font-medium">
                {companyInfo.phone}
              </a>
              <br />
              <a href={`mailto:${companyInfo.email}`} className="text-[#94a3b8] hover:text-[#f87171] transition-colors text-sm">
                {companyInfo.email}
              </a>
            </div>

            {/* Opening hours */}
            <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-6">
              <h3 className="text-lg font-semibold text-[#f0f2f5] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t.contact.hours}
              </h3>
              <ul className="space-y-1">
                {i.hours.map((h) => (
                  <li key={h} className="text-[#94a3b8] text-sm">{h}</li>
                ))}
              </ul>
            </div>

            {/* Map */}
            <div className="bg-[#0c1221] rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[#f0f2f5] flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {i.mapLabel}
                </h3>
              </div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2688.5!2d17.5644!3d47.9862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476c4a5f5f5f5f5f%3A0x0!2sElia%C5%A1ovce+82%2C+930+38+Nov%C3%BD+%C5%BDivot!5e0!3m2!1ssk!2ssk!4v1"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
