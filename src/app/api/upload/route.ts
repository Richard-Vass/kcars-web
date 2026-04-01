import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const filename = request.nextUrl.searchParams.get("filename") || `${Date.now()}.jpg`;
  const body = await request.arrayBuffer();

  const { data, error } = await supabase.storage
    .from("car-images")
    .upload(`cars/${filename}`, body, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage
    .from("car-images")
    .getPublicUrl(data.path);

  return NextResponse.json({ url: urlData.publicUrl });
}
