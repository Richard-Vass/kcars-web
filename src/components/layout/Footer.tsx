import Link from "next/link";
import Image from "next/image";
import { Locale } from "@/lib/i18n";
import { companyInfo } from "@/lib/contact";

interface FooterProps {
  locale: Locale;
  t: {
    nav: { home: string; cars: string; about: string; contact: string };
    footer: { rights: string; privacy: string; terms: string };
  };
}

export default function Footer({ locale, t }: FooterProps) {
  const navLinks = [
    { href: `/${locale}/ponuka`, label: locale === "sk" ? "Ponuka vozidiel" : locale === "hu" ? "Autókínálat" : locale === "de" ? "Fahrzeugangebot" : "Car Listings" },
    { href: `/${locale}/vykup-vozidiel`, label: locale === "sk" ? "Výkup vozidiel" : locale === "hu" ? "Járművásárlás" : locale === "de" ? "Fahrzeugankauf" : "Vehicle Buyback" },
    { href: `/${locale}/komisny-predaj`, label: locale === "sk" ? "Komisný predaj" : locale === "hu" ? "Bizomány" : locale === "de" ? "Kommission" : "Consignment" },
    { href: `/${locale}/leasing`, label: locale === "sk" ? "Financovanie" : locale === "hu" ? "Finanszírozás" : locale === "de" ? "Finanzierung" : "Financing" },
    { href: `/${locale}/kontakt`, label: t.nav.contact },
  ];

  return (
    <footer className="bg-[#060a12] border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Image
              src="/images/logo-white.png"
              alt="KCars"
              width={120}
              height={39}
              className="mb-3"
            />
            <p className="text-sm text-[#6b7a94] mt-2">{companyInfo.name}</p>
            <p className="text-sm text-[#6b7a94]">{companyInfo.address}, {companyInfo.city}</p>
            <p className="text-sm text-[#6b7a94]">IČO: {companyInfo.ico}</p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-[#6b7a94] uppercase tracking-[2px] mb-5">
              Menu
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#6b7a94] hover:text-[#f0f2f5] transition-colors">
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
              <li>
                <a href={`tel:${companyInfo.phone}`} className="hover:text-[#f87171] transition-colors">
                  {companyInfo.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${companyInfo.email}`} className="hover:text-[#f87171] transition-colors">
                  {companyInfo.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#6b7a94]/50">
            &copy; {new Date().getFullYear()} KCARS | {t.footer.rights}
          </p>
          <div className="flex gap-6">
            <span className="text-xs text-[#6b7a94]/50 hover:text-[#6b7a94] cursor-pointer transition-colors">
              {locale === "sk" ? "Ochrana osobných údajov" : t.footer.privacy}
            </span>
            <span className="text-xs text-[#6b7a94]/50 hover:text-[#6b7a94] cursor-pointer transition-colors">
              {locale === "sk" ? "Používanie cookies" : t.footer.terms}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
