import Link from "next/link";
import Image from "next/image";
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
    <footer className="bg-[#060a12] border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Image
              src="/images/logo.png"
              alt="KCars"
              width={120}
              height={39}
              className="invert mb-3"
            />
            <p className="text-sm text-[#6b7a94]">www.kcars.sk</p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-[#6b7a94] uppercase tracking-[2px] mb-5">
              Menu
            </h3>
            <ul className="space-y-3">
              {[
                { href: `/${locale}`, label: t.nav.home },
                { href: `/${locale}/ponuka`, label: t.nav.cars },
                { href: `/${locale}/o-nas`, label: t.nav.about },
                { href: `/${locale}/kontakt`, label: t.nav.contact },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#6b7a94] hover:text-[#f0f2f5] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold text-[#6b7a94] uppercase tracking-[2px] mb-5">
              {t.nav.contact}
            </h3>
            <ul className="space-y-2 text-sm text-[#6b7a94]">
              <li>info@kcars.sk</li>
              <li>+421 XXX XXX XXX</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#6b7a94]/50">
            &copy; {new Date().getFullYear()} KCars. {t.footer.rights}.
          </p>
          <div className="flex gap-6">
            <span className="text-xs text-[#6b7a94]/50 hover:text-[#6b7a94] cursor-pointer transition-colors">
              {t.footer.privacy}
            </span>
            <span className="text-xs text-[#6b7a94]/50 hover:text-[#6b7a94] cursor-pointer transition-colors">
              {t.footer.terms}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
