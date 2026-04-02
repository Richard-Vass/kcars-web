import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { locales } from "@/lib/i18n";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://kcars.sk";

  const pages = ["", "/ponuka", "/vykup-vozidiel", "/komisny-predaj", "/leasing", "/kontakt", "/o-nas"];

  const staticPages = locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: page === "/ponuka" ? ("hourly" as const) : ("weekly" as const),
      priority: page === "" ? 1 : page === "/ponuka" ? 0.9 : 0.7,
    }))
  );

  // Dynamic car pages
  const { data: cars } = await supabase
    .from("cars")
    .select("slug, updated_at")
    .neq("body_type", "doplnky");

  const carPages = (cars || []).flatMap((car) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/ponuka/${car.slug}`,
      lastModified: new Date(car.updated_at),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }))
  );

  return [...staticPages, ...carPages];
}
