import Link from "next/link";
import { Locale } from "@/lib/i18n";

interface FooterProps {
  locale: Locale;
  t: {
    nav: { home: string; cars: string; about: string; contact: string };
    footer: { rights: string; privacy: string; terms: string };
  };
}

export default function Footer({ locale, t }: FooterProps) {
  return (
    <footer className="bg-zinc-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <span className="text-2xl font-bold text-white">
              K <span className="text-red-500">cars</span>
            </span>
            <p className="mt-3 text-sm text-white/50">www.kcars.sk</p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
              Menu
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}`}
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/ponuka`}
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  {t.nav.cars}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/o-nas`}
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/kontakt`}
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
              {t.nav.contact}
            </h3>
            <ul className="space-y-2 text-sm text-white/50">
              <li>info@kcars.sk</li>
              <li>+421 XXX XXX XXX</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} KCars. {t.footer.rights}.
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-white/30 hover:text-white/50 cursor-pointer transition-colors">
              {t.footer.privacy}
            </span>
            <span className="text-xs text-white/30 hover:text-white/50 cursor-pointer transition-colors">
              {t.footer.terms}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
