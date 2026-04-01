export const locales = ["sk", "hu", "de", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "sk";

export const localeNames: Record<Locale, string> = {
  sk: "Slovenčina",
  hu: "Magyar",
  de: "Deutsch",
  en: "English",
};

export const localeFlags: Record<Locale, string> = {
  sk: "🇸🇰",
  hu: "🇭🇺",
  de: "🇩🇪",
  en: "🇬🇧",
};

export async function getTranslations(locale: Locale) {
  const translations = await import(`../../public/locales/${locale}.json`);
  return translations.default;
}
