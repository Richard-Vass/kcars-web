import { NextRequest, NextResponse } from "next/server";

// Server-side image proxy for autobazar.eu photos
// Bypasses hotlink protection by fetching from server
// URL: /api/img/[encoded_path]/[hash]

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const imagePath = path.join("/");
  const imageUrl = `https://img.autobazar.eu/foto/${imagePath}`;

  try {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; KCars/1.0)",
        "Referer": "https://www.autobazar.eu/",
      },
    });

    if (!response.ok) {
      return new NextResponse(null, { status: 404 });
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/webp";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
        "CDN-Cache-Control": "public, max-age=604800",
      },
    });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
