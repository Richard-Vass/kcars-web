import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, Outfit } from "next/font/google";
import { locales, Locale, getTranslations } from "@/lib/i18n";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
  title: "KCars | Autobazár",
  description:
    "Široký výber overených jazdených vozidiel za férové ceny. Wide selection of verified used vehicles at fair prices.",
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

  return (
    <div className={`${outfit.variable} min-h-full flex flex-col`}>
      <Navbar locale={locale as Locale} t={t} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale as Locale} t={t} />
    </div>
  );
}
