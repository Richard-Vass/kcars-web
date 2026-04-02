import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, Outfit } from "next/font/google";
import { locales, Locale, getTranslations } from "@/lib/i18n";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import CookieBanner from "@/components/ui/CookieBanner";
import "../globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kcars.sk"),
  title: {
    default: "K cars | Autobazár Nový Život — Predaj jazdených vozidiel",
    template: "%s | K cars Autobazár",
  },
  description:
    "K cars s.r.o. — Autobazár v Novom Živote. Široký výber overených jazdených vozidiel za férové ceny. Výkup, komisný predaj, financovanie. ☎ 0905 489 662",
  keywords: [
    "autobazár", "autobazar", "jazdené autá", "ojazdené autá", "predaj áut",
    "výkup áut", "komisný predaj", "leasing", "financovanie",
    "Nový Život", "Šamorín", "Dunajská Streda", "Eliášovce",
    "K cars", "kcars", "autobazar.eu",
  ],
  authors: [{ name: "K cars s.r.o." }],
  openGraph: {
    title: "K cars | Autobazár Nový Život",
    description: "Široký výber overených jazdených vozidiel za férové ceny. Výkup, komisný predaj, financovanie.",
    url: "https://kcars.sk",
    siteName: "K cars",
    locale: "sk_SK",
    type: "website",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630 }],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const t = await getTranslations(locale as Locale);

  const alternateLinks = locales.map((l) => ({
    hrefLang: l,
    href: `https://kcars.sk/${l}`,
  }));

  return (
    <html lang={locale} className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <head>
        {/* Hreflang tags */}
        {alternateLinks.map((link) => (
          <link key={link.hrefLang} rel="alternate" hrefLang={link.hrefLang} href={link.href} />
        ))}
        <link rel="alternate" hrefLang="x-default" href="https://kcars.sk/sk" />
      </head>
      <body className="min-h-full flex flex-col bg-[#060a12] text-[#f0f2f5] font-sans">
        <Navbar locale={locale as Locale} t={t} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale as Locale} t={t} />
        <WhatsAppButton />
        <CookieBanner />
      </body>
    </html>
  );
}
