"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Locale, locales, localeFlags, localeNames } from "@/lib/i18n";

interface NavbarProps {
  locale: Locale;
  t: {
    nav: {
      home: string;
      cars: string;
      about: string;
      contact: string;
    };
  };
}

export default function Navbar({ locale, t }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navLinks = [
    { href: `/${locale}/ponuka`, label: locale === "sk" ? "Ponuka vozidiel" : locale === "hu" ? "Autókínálat" : locale === "de" ? "Fahrzeugangebot" : "Car Listings" },
    { href: `/${locale}/vykup-vozidiel`, label: locale === "sk" ? "Výkup vozidiel" : locale === "hu" ? "Járművásárlás" : locale === "de" ? "Fahrzeugankauf" : "Vehicle Buyback" },
    { href: `/${locale}/komisny-predaj`, label: locale === "sk" ? "Komisný predaj" : locale === "hu" ? "Bizomány" : locale === "de" ? "Kommission" : "Consignment" },
    { href: `/${locale}/leasing`, label: locale === "sk" ? "Financovanie" : locale === "hu" ? "Finanszírozás" : locale === "de" ? "Finanzierung" : "Financing" },
    { href: `/${locale}/kontakt`, label: t.nav.contact },
  ];

  function switchLocale(newLocale: Locale) {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    return segments.join("/");
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#060a12]/92 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-[76px]">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center">
            <Image
              src="/images/logo-white.png"
              alt="KCars"
              width={140}
              height={45}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[0.85rem] font-medium tracking-wide transition-colors hover:text-[#f0f2f5] ${
                  pathname === link.href ? "text-[#f0f2f5]" : "text-[#6b7a94]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Language switcher + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-sm text-[#6b7a94] hover:text-[#f0f2f5] transition-colors"
              >
                {localeFlags[locale]} {locale.toUpperCase()}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[#0c1221] border border-white/5 rounded-xl shadow-xl overflow-hidden">
                  {locales.map((l) => (
                    <Link
                      key={l}
                      href={switchLocale(l)}
                      onClick={() => setLangOpen(false)}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${
                        l === locale ? "text-[#f87171]" : "text-[#6b7a94]"
                      }`}
                    >
                      {localeFlags[l]} {localeNames[l]}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              href={`/${locale}/kontakt`}
              className="bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-[0_4px_20px_rgba(239,68,68,0.25)] hover:shadow-[0_8px_30px_rgba(239,68,68,0.35)] hover:-translate-y-0.5 transition-all"
            >
              {t.nav.contact}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Zavrieť menu" : "Otvoriť menu"}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#060a12]/95 backdrop-blur-xl border-t border-white/5">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block text-base font-medium transition-colors ${
                  pathname === link.href ? "text-[#f87171]" : "text-[#6b7a94]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-3 border-t border-white/5">
              {locales.map((l) => (
                <Link
                  key={l}
                  href={switchLocale(l)}
                  onClick={() => setMobileOpen(false)}
                  className={`text-lg ${l === locale ? "opacity-100" : "opacity-50"}`}
                >
                  {localeFlags[l]}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
