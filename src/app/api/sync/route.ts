import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Auto-sync from autobazar.eu → KCars Supabase
// Uses __NEXT_DATA__ JSON from AB.eu dealer page (structured data, not HTML scraping)
// Runs as Vercel cron: GET /api/sync

const DEALER_URL = "https://www.autobazar.eu/predajca/zolino2/";
const MAX_PAGES = 10;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const key = request.nextUrl.searchParams.get("key");
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const isManual = key === process.env.SYNC_SECRET_KEY;

  if (!isCron && !isManual) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const allCars: ParsedCar[] = [];

    for (let page = 1; page <= MAX_PAGES; page++) {
      const url = page === 1 ? DEALER_URL : `${DEALER_URL}?page=${page}`;
      const response = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; KCars/1.0)" },
      });

      if (!response.ok) break;
      const html = await response.text();

      // Extract __NEXT_DATA__ JSON
      const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
      if (!nextDataMatch) {
        // Fallback: try HTML parsing
        const htmlCars = parseHtmlFallback(html);
        if (htmlCars.length === 0) break;
        allCars.push(...htmlCars);
        continue;
      }

      const nextData = JSON.parse(nextDataMatch[1]);
      const cars = extractCarsFromNextData(nextData);

      if (cars.length === 0) break;
      allCars.push(...cars);
    }

    if (allCars.length === 0) {
      return NextResponse.json({
        error: "No cars found",
        hint: "AB.eu page structure may have changed",
      }, { status: 500 });
    }

    // Get existing cars from DB
    const { data: existing } = await supabase
      .from("cars")
      .select("id, autobazar_eu_id, price, mileage, status");

    const existingMap = new Map(
      (existing || []).map((c) => [c.autobazar_eu_id, c])
    );

    let imported = 0;
    let updated = 0;
    let unchanged = 0;
    const scrapedIds = new Set<string>();

    for (const car of allCars) {
      if (!car.abId) continue;
      scrapedIds.add(car.abId);

      const ex = existingMap.get(car.abId);

      if (ex) {
        if (ex.price !== car.price || ex.mileage !== car.mileage) {
          await supabase
            .from("cars")
            .update({
              price: car.price,
              mileage: car.mileage,
              images: car.images,
              status: "available",
              updated_at: new Date().toISOString(),
            })
            .eq("id", ex.id);
          updated++;
        } else {
          unchanged++;
        }
      } else {
        const slug = generateSlug(car.brand, car.model, car.year);
        await supabase.from("cars").insert({
          brand: car.brand,
          model: car.model,
          slug,
          year: car.year,
          price: car.price,
          mileage: car.mileage,
          fuel: car.fuel,
          transmission: car.transmission,
          power_kw: car.powerKw,
          engine_capacity: car.engineCapacity,
          color: car.color,
          body_type: car.bodyType,
          doors: 4,
          images: car.images,
          featured: false,
          status: "available",
          autobazar_eu_id: car.abId,
        });
        imported++;
      }
    }

    // Mark removed cars as sold
    let removed = 0;
    for (const [abId, ex] of existingMap) {
      if (abId && !scrapedIds.has(abId) && ex.status === "available") {
        await supabase
          .from("cars")
          .update({ status: "sold", updated_at: new Date().toISOString() })
          .eq("id", ex.id);
        removed++;
      }
    }

    return NextResponse.json({
      success: true,
      total_scraped: allCars.length,
      imported,
      updated,
      unchanged,
      removed,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      error: "Sync failed",
      message: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}

interface ParsedCar {
  abId: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  powerKw: number;
  engineCapacity: number;
  color: string;
  bodyType: string;
  images: string[];
}

function extractCarsFromNextData(nextData: Record<string, unknown>): ParsedCar[] {
  const cars: ParsedCar[] = [];

  try {
    // Navigate through __NEXT_DATA__ structure to find car listings
    // AB.eu uses pageProps.dehydratedState or similar
    const props = nextData.props as Record<string, unknown>;
    const pageProps = props?.pageProps as Record<string, unknown>;

    // Find car array in various possible locations
    let listings: Record<string, unknown>[] = [];

    // Try common Next.js data paths
    const findArrays = (obj: unknown, depth = 0): Record<string, unknown>[] => {
      if (depth > 5 || !obj || typeof obj !== "object") return [];
      if (Array.isArray(obj)) {
        // Check if this looks like a car array
        if (obj.length > 0 && obj[0] && typeof obj[0] === "object" && "brand" in (obj[0] as Record<string, unknown>)) {
          return obj as Record<string, unknown>[];
        }
      }
      for (const val of Object.values(obj as Record<string, unknown>)) {
        const result = findArrays(val, depth + 1);
        if (result.length > 0) return result;
      }
      return [];
    };

    listings = findArrays(pageProps);
    if (listings.length === 0) listings = findArrays(nextData);

    const fuelMap: Record<string, string> = {
      "benzín": "petrol", "benzin": "petrol",
      "nafta": "diesel", "diesel": "diesel",
      "elektro": "electric", "elektrický": "electric",
      "hybrid": "hybrid", "plug-in hybrid": "hybrid", "plug-in": "hybrid",
    };

    const bodyMap: Record<string, string> = {
      "hatchback": "hatchback", "sedan": "sedan", "limuzína": "sedan",
      "combi": "kombi", "kombi": "kombi", "suv": "SUV",
      "pick-up": "SUV", "kabriolet": "kabriolet", "kupé": "sedan",
      "mpv": "van", "van": "van", "minibus": "minibus",
    };

    for (const item of listings) {
      const brand = String(item.brand || "");
      const model = String(item.carModel || item.model || "");
      if (!brand) continue;

      const fuel = fuelMap[(String(item.fuel || "benzín")).toLowerCase()] || "petrol";
      const gearbox = String(item.gearbox || "");
      const isAutomatic = /automat|dsg|tiptronic|s.tronic/i.test(gearbox);
      const bodyType = bodyMap[(String(item.bodyworkValue || item.bodywork || "")).toLowerCase()] || "sedan";

      // Extract images
      const images: string[] = [];
      if (item.images && Array.isArray(item.images)) {
        for (const img of item.images as Record<string, unknown>[]) {
          const imgId = String(img.id || "");
          if (imgId) {
            // Use img.autobazar.eu CDN with larger size
            images.push(`https://img.autobazar.eu/foto/OTAweDY3NS9maWx0ZXJzOnF1YWxpdHkoODUpOmZvcm1hdCh3ZWJwKS9hc2s=/${imgId}`);
          }
        }
      }
      if (item.image && typeof item.image === "object") {
        const mainImg = item.image as Record<string, unknown>;
        const mainId = String(mainImg.id || "");
        if (mainId && !images.some(u => u.includes(mainId))) {
          images.unshift(`https://img.autobazar.eu/foto/OTAweDY3NS9maWx0ZXJzOnF1YWxpdHkoODUpOmZvcm1hdCh3ZWJwKS9hc2s=/${mainId}`);
        }
      }

      cars.push({
        abId: String(item.id || ""),
        brand,
        model,
        year: Number(item.yearValue || item.year || 0),
        price: Number(item.finalPrice || item.price || 0),
        mileage: Number(item.mileage || 0),
        fuel,
        transmission: isAutomatic ? "automatic" : "manual",
        powerKw: Number(item.enginePower || 0),
        engineCapacity: Number(item.engineCapacity || 0),
        color: String(item.color || item.colorValue || ""),
        bodyType,
        images: images.slice(0, 10),
      });
    }
  } catch {
    // JSON parsing failed
  }

  return cars;
}

function parseHtmlFallback(html: string): ParsedCar[] {
  // Simple fallback if __NEXT_DATA__ is not available
  const cars: ParsedCar[] = [];
  const detailLinks = html.match(/href="\/detail\/[^"]+"/g) || [];

  for (const link of detailLinks) {
    const href = link.replace('href="', '').replace('"', '');
    const idMatch = href.match(/\/([A-Za-z0-9]+)\/$/);
    if (!idMatch) continue;

    // Extract title from nearby text
    const titleMatch = html.match(new RegExp(`<h3[^>]*>([^<]+)</h3>[\\s\\S]{0,500}${idMatch[1]}`));
    const priceMatch = html.match(new RegExp(`(\\d[\\d\\s]+)\\s*€[\\s\\S]{0,500}${idMatch[1]}`));

    if (titleMatch) {
      const title = titleMatch[1].trim();
      const brandModel = parseBrandModel(title);

      cars.push({
        abId: idMatch[1],
        brand: brandModel.brand,
        model: brandModel.model,
        year: 0,
        price: priceMatch ? parseInt(priceMatch[1].replace(/\s/g, "")) : 0,
        mileage: 0,
        fuel: "petrol",
        transmission: "manual",
        powerKw: 0,
        engineCapacity: 0,
        color: "",
        bodyType: "sedan",
        images: [],
      });
    }
  }

  return cars;
}

function parseBrandModel(title: string): { brand: string; model: string } {
  const knownBrands = [
    "Volkswagen", "Škoda", "Audi", "BMW", "Mercedes-Benz",
    "Tesla", "Porsche", "Volvo", "Toyota", "Hyundai", "Kia", "Ford",
    "Opel", "Peugeot", "Fiat", "Seat", "Cupra", "Honda", "Yamaha",
    "Mitsubishi", "DAF", "Kogel", "Citroën", "Renault",
  ];

  for (const brand of knownBrands) {
    if (title.toLowerCase().startsWith(brand.toLowerCase())) {
      return { brand, model: title.substring(brand.length).trim() };
    }
  }

  const parts = title.split(" ");
  return { brand: parts[0], model: parts.slice(1).join(" ") };
}

function generateSlug(brand: string, model: string, year: number): string {
  const base = `${brand}-${model}-${year}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}
