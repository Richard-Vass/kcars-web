import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Sync from autobazar.eu XML feed → KCars Supabase
// Set AUTOBAZAR_EU_FEED_URL in env vars to enable
// Call via cron: GET /api/sync?key=SYNC_SECRET_KEY

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");

  if (key !== process.env.SYNC_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const feedUrl = process.env.AUTOBAZAR_EU_FEED_URL;

  if (!feedUrl) {
    return NextResponse.json({
      error: "AUTOBAZAR_EU_FEED_URL not configured",
      info: "Set this env var to the XML feed URL from autobazar.eu",
    }, { status: 400 });
  }

  try {
    // Fetch XML from autobazar.eu
    const response = await fetch(feedUrl);
    const xmlText = await response.text();

    // Parse XML — basic regex parser for common AB.eu format
    // Will be adjusted once we know their exact XML structure
    const cars = parseAutobazarXml(xmlText);

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const car of cars) {
      // Check if car already exists by autobazar_eu_id
      const { data: existing } = await supabase
        .from("cars")
        .select("id")
        .eq("autobazar_eu_id", car.autobazar_eu_id)
        .single();

      if (existing) {
        // Update existing car
        const { error } = await supabase
          .from("cars")
          .update({
            price: car.price,
            mileage: car.mileage,
            status: car.status,
            images: car.images,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (!error) updated++;
        else skipped++;
      } else {
        // Insert new car
        const slug = generateSlug(car.brand, car.model, car.year);
        const { error } = await supabase.from("cars").insert({
          ...car,
          slug,
          featured: false,
        });

        if (!error) imported++;
        else skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      total: cars.length,
      imported,
      updated,
      skipped,
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
  autobazar_eu_id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  power_kw: number;
  engine_capacity: number;
  color: string;
  body_type: string;
  doors: number;
  description_sk: string;
  images: string[];
  status: string;
}

function parseAutobazarXml(xml: string): ParsedCar[] {
  const cars: ParsedCar[] = [];

  // Match each <car> or <item> block
  const carBlocks = xml.match(/<(?:car|item)[\s>][\s\S]*?<\/(?:car|item)>/gi) || [];

  for (const block of carBlocks) {
    try {
      const get = (tag: string) => {
        const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
        return match ? match[1].trim().replace(/<!\[CDATA\[|\]\]>/g, "") : "";
      };

      const id = get("id") || get("guid") || get("inzerat_id") || "";
      const brand = get("brand") || get("znacka") || get("manufacturer") || "";
      const model = get("model") || "";

      if (!brand || !model) continue;

      const fuelMap: Record<string, string> = {
        benzín: "petrol", benzin: "petrol", petrol: "petrol", gasoline: "petrol",
        nafta: "diesel", diesel: "diesel",
        elektro: "electric", electric: "electric", ev: "electric",
        hybrid: "hybrid", "plug-in hybrid": "hybrid",
      };

      const transMap: Record<string, string> = {
        manuálna: "manual", manualna: "manual", manual: "manual", manuál: "manual",
        automatická: "automatic", automaticka: "automatic", automatic: "automatic", automat: "automatic",
      };

      const rawFuel = (get("fuel") || get("palivo") || "petrol").toLowerCase();
      const rawTrans = (get("transmission") || get("prevodovka") || "manual").toLowerCase();

      const images: string[] = [];
      const imgMatches = block.match(/<(?:image|photo|img|foto)[^>]*>([^<]+)<\/(?:image|photo|img|foto)>/gi) || [];
      for (const imgMatch of imgMatches) {
        const url = imgMatch.replace(/<[^>]+>/g, "").trim();
        if (url.startsWith("http")) images.push(url);
      }
      // Also check thumb/thumbnail
      const thumb = get("thumb") || get("thumbnail") || get("hlavna_foto") || "";
      if (thumb && thumb.startsWith("http") && !images.includes(thumb)) {
        images.unshift(thumb);
      }

      cars.push({
        autobazar_eu_id: id,
        brand,
        model,
        year: parseInt(get("year") || get("rok") || get("rok_vyroby") || "0") || new Date().getFullYear(),
        price: parseFloat(get("price") || get("cena") || "0") || 0,
        mileage: parseInt(get("mileage") || get("km") || get("najazdene") || "0") || 0,
        fuel: fuelMap[rawFuel] || "petrol",
        transmission: transMap[rawTrans] || "manual",
        power_kw: parseInt(get("power_kw") || get("vykon") || get("power") || "0") || 0,
        engine_capacity: parseInt(get("engine_capacity") || get("objem") || get("ccm") || "0") || 0,
        color: get("color") || get("farba") || "",
        body_type: get("body_type") || get("karoseria") || get("typ_karoserie") || "",
        doors: parseInt(get("doors") || get("dvere") || get("pocet_dveri") || "4") || 4,
        description_sk: get("description") || get("popis") || get("text") || "",
        images,
        status: "available",
      });
    } catch {
      continue;
    }
  }

  return cars;
}

function generateSlug(brand: string, model: string, year: number): string {
  const base = `${brand}-${model}-${year}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Add random suffix to avoid duplicates
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}
