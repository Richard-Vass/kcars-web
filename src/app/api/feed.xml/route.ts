import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Car } from "@/types";

export async function GET() {
  const { data } = await supabase
    .from("cars")
    .select("*")
    .in("status", ["available", "reserved"])
    .order("created_at", { ascending: false });

  const cars = (data || []) as Car[];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<export>
  <dealer>
    <name>KCars</name>
    <url>https://kcars.sk</url>
    <updated>${new Date().toISOString()}</updated>
  </dealer>
  <cars>
${cars
  .map(
    (car) => `    <car>
      <id>${car.id}</id>
      <brand>${escapeXml(car.brand)}</brand>
      <model>${escapeXml(car.model)}</model>
      <year>${car.year}</year>
      <price>${car.price}</price>
      <currency>EUR</currency>
      <mileage>${car.mileage}</mileage>
      <fuel>${car.fuel}</fuel>
      <transmission>${car.transmission}</transmission>
      <power_kw>${car.power_kw}</power_kw>
      <engine_capacity>${car.engine_capacity || ""}</engine_capacity>
      <color>${escapeXml(car.color || "")}</color>
      <body_type>${escapeXml(car.body_type || "")}</body_type>
      <doors>${car.doors || ""}</doors>
      <vin>${escapeXml(car.vin || "")}</vin>
      <status>${car.status}</status>
      <description>${escapeXml(car.description_sk || "")}</description>
      <url>https://kcars.sk/sk/ponuka/${car.slug}</url>
      <images>
${(car.images || []).map((img) => `        <image>${escapeXml(img)}</image>`).join("\n")}
      </images>
    </car>`
  )
  .join("\n")}
  </cars>
</export>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
