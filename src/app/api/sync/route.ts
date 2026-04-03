import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Auto-sync from autobazar.eu dealer page → KCars Supabase
// Runs as Vercel cron every hour: GET /api/sync
// Also callable manually: GET /api/sync?key=SYNC_SECRET_KEY

const DEALER_URL = "https://www.autobazar.eu/predajca/zolino2/";
const MAX_PAGES = 10;

export async function GET(request: NextRequest) {
  // Auth check (skip for Vercel cron which sends authorization header)
  const authHeader = request.headers.get("authorization");
  const key = request.nextUrl.searchParams.get("key");
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const isManual = key === process.env.SYNC_SECRET_KEY;

  if (!isCron && !isManual) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Scrape all pages from dealer profile
    const allCars: ScrapedCar[] = [];

    for (let page = 1; page <= MAX_PAGES; page++) {
      const url = page === 1 ? DEALER_URL : `${DEALER_URL}?page=${page}`;
      const response = await fetch(url, {
        headers: { "User-Agent": "KCars-Sync/1.0" },
      });

      if (!response.ok) break;

      const html = await response.text();
      const cars = parseListingPage(html);

      if (cars.length === 0) break;
      allCars.push(...cars);
    }

    if (allCars.length === 0) {
      return NextResponse.json({ error: "No cars found on dealer page" }, { status: 500 });
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

      // Fetch all photos from detail page
      const allPhotos = await fetchCarPhotos(car.abId);
      if (allPhotos.length > 0) {
        car.images = allPhotos;
      }

      if (ex) {
        // Update price, mileage, or photos
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
        // New car — insert
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

    // Mark cars not on AB.eu anymore as sold
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

interface ScrapedCar {
  abId: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  powerKw: number;
  color: string;
  bodyType: string;
  images: string[];
}

function parseListingPage(html: string): ScrapedCar[] {
  const cars: ScrapedCar[] = [];

  // Match car listing blocks — AB.eu uses structured HTML with data attributes
  // Each car has a link to /inzerat/[id]/...
  const carBlocks = html.match(/<a[^>]*href="\/inzerat\/(\d+)\/[^"]*"[^>]*>[\s\S]*?<\/a>/gi) || [];

  // Alternative: match article or div blocks with car data
  const articleBlocks = html.match(/<article[\s\S]*?<\/article>/gi) || [];
  const blocks = articleBlocks.length > 0 ? articleBlocks : carBlocks;

  for (const block of blocks) {
    try {
      // Extract AB ID from link
      const idMatch = block.match(/\/inzerat\/(\d+)\//);
      if (!idMatch) continue;
      const abId = idMatch[1];

      // Extract title
      const titleMatch = block.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/i);
      const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : "";
      if (!title) continue;

      // Extract price
      const priceMatch = block.match(/([\d\s,.]+)\s*€/);
      const price = priceMatch
        ? parseFloat(priceMatch[1].replace(/\s/g, "").replace(",", "."))
        : 0;

      // Extract image — prefer thumbs URL (works without hotlink protection)
      const thumbsMatch = block.match(/(?:src|data-src)="(https:\/\/www\.autobazar\.eu\/thumbs\/[^"]+)"/i);
      const imgMatch = block.match(/(?:src|data-src)="(https:\/\/img\.autobazar\.eu\/[^"]+)"/i);
      const images = thumbsMatch ? [thumbsMatch[1]] : imgMatch ? [imgMatch[1]] : [];

      // If we have an AB ID but no thumbs URL, try to construct one from pattern
      // Pattern: https://www.autobazar.eu/thumbs/{folder}/{id}_big.jpg
      if (images.length === 0 && idMatch[1]) {
        // We'll use img.autobazar.eu as fallback, proxy will handle it
      }

      // Extract year, km, fuel, power from text
      const textContent = block.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

      const yearMatch = textContent.match(/(\d{4})/);
      const year = yearMatch ? parseInt(yearMatch[1]) : 0;
      if (year < 1900 || year > 2030) continue;

      const kmMatch = textContent.match(/([\d\s,.]+)\s*km/i);
      const mileage = kmMatch
        ? parseInt(kmMatch[1].replace(/[\s,.]/g, ""))
        : 0;

      const kwMatch = textContent.match(/(\d+)\s*kW/i);
      const powerKw = kwMatch ? parseInt(kwMatch[1]) : 0;

      // Determine fuel type
      const fuelMap: Record<string, string> = {
        benzín: "petrol", benzin: "petrol",
        nafta: "diesel", diesel: "diesel",
        elektro: "electric", electric: "electric",
        hybrid: "hybrid", "plug-in": "hybrid",
      };
      let fuel = "petrol";
      for (const [key, val] of Object.entries(fuelMap)) {
        if (textContent.toLowerCase().includes(key)) {
          fuel = val;
          break;
        }
      }

      // Determine transmission
      const isAutomatic = /A\/T|DSG|automat|tiptronic|S tronic|A[67]/i.test(textContent);
      const transmission = isAutomatic ? "automatic" : "manual";

      // Parse brand and model from title
      const brandModel = parseBrandModel(title);

      // Determine body type from keywords
      const bodyType = detectBodyType(textContent, title);

      cars.push({
        abId,
        brand: brandModel.brand,
        model: brandModel.model,
        year,
        price,
        mileage,
        fuel,
        transmission,
        powerKw: powerKw,
        color: "",
        bodyType,
        images,
      });
    } catch {
      continue;
    }
  }

  return cars;
}

function parseBrandModel(title: string): { brand: string; model: string } {
  const knownBrands = [
    "Volkswagen", "Škoda", "Audi", "BMW", "Mercedes-Benz", "Mercedes",
    "Tesla", "Porsche", "Volvo", "Toyota", "Hyundai", "Kia", "Ford",
    "Opel", "Peugeot", "Fiat", "Seat", "Cupra", "Honda", "Yamaha",
    "Mitsubishi", "DAF", "Kogel", "Citroën", "Renault", "Suzuki",
    "Mazda", "Nissan", "Land Rover", "Jaguar", "Mini", "Dacia",
  ];

  for (const brand of knownBrands) {
    if (title.toLowerCase().startsWith(brand.toLowerCase())) {
      return {
        brand,
        model: title.substring(brand.length).trim(),
      };
    }
  }

  // Fallback: first word is brand
  const parts = title.split(" ");
  return {
    brand: parts[0],
    model: parts.slice(1).join(" "),
  };
}

function detectBodyType(text: string, title: string): string {
  const combined = (text + " " + title).toLowerCase();
  if (/suv|crossover|q[2358]|tiguan|tucson|karoq|kodiaq|kamiq|t-cross|cayenne|gle|glc|gla|xc40|rav4|formentor|arona/i.test(combined)) return "SUV";
  if (/combi|variant|touring|avant|allspace/i.test(combined)) return "kombi";
  if (/sedan|limousine|a[3468]|rad [357]|model 3|e trieda|passat(?! variant)/i.test(combined)) return "sedan";
  if (/hatchback|golf(?! variant)|polo|rad 1|i3|id\.3|500(?!.*c )/i.test(combined)) return "hatchback";
  if (/cabrio|kabriol|500 c/i.test(combined)) return "kabriolet";
  if (/van|transporter|caravelle|multivan|vivaro|rifter/i.test(combined)) return "van";
  if (/skúter|scooter|pcx|x-max/i.test(combined)) return "skúter";
  if (/náves|trailer|kogel/i.test(combined)) return "náves";
  if (/nákladné|truck|lf45|daf/i.test(combined)) return "nákladné";
  if (/disk|pneumat|r1[789]|r20|5x112/i.test(combined)) return "disky";
  return "sedan";
}

async function fetchCarPhotos(abId: string): Promise<string[]> {
  try {
    const res = await fetch(
      `https://www.autobazar.eu/wb/zolino2/card_white.php?id=${abId}`,
      { headers: { "User-Agent": "KCars-Sync/1.0" } }
    );
    if (!res.ok) return [];
    const html = await res.text();

    // Extract folder from thumbs URLs
    const folderMatch = html.match(/\/thumbs\/(\d+)\//);
    if (!folderMatch) return [];
    const folder = folderMatch[1];

    // Count photos by finding all thumb image references
    const thumbMatches = html.match(new RegExp(`${abId}_\\d+\\.jpg`, "g")) || [];
    const uniqueNums = new Set<number>();
    for (const m of thumbMatches) {
      const numMatch = m.match(/_(\d+)\.jpg/);
      if (numMatch) uniqueNums.add(parseInt(numMatch[1]));
    }
    // Also check for _big.jpg (= photo 1)
    if (html.includes(`${abId}_big.jpg`)) uniqueNums.add(1);

    const maxPhoto = Math.max(...uniqueNums, 1);
    // Use full-size /pics/ URLs, limit to first 10 for performance
    const limit = Math.min(maxPhoto, 10);
    const photos: string[] = [];
    for (let i = 1; i <= limit; i++) {
      photos.push(`https://www.autobazar.eu/pics/${folder}/${abId}_${i}.jpg`);
    }
    return photos;
  } catch {
    return [];
  }
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
