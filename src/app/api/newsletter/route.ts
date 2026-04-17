import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

interface Payload {
  email: string;
  locale?: string;
}

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(request: NextRequest) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, locale } = body;

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Valid email is required" },
      { status: 400 }
    );
  }

  // Save to Supabase — tabuľka `newsletter_subscribers`
  // (Ak tabuľka neexistuje, túto časť vynecháme a zaznamenáme len do logov)
  try {
    const { error: dbError } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        {
          email: email.toLowerCase().trim(),
          locale: locale || "sk",
          source: "website",
        },
        { onConflict: "email" }
      );

    if (dbError && dbError.code !== "42P01" /* table not found */) {
      console.error("Newsletter insert error:", dbError);
    }
  } catch (err) {
    console.error("Newsletter DB fail (non-blocking):", err);
  }

  // Optional: notifikovať admina
  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL || "vass@vassweb.com";
  if (resendKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "KCars <no-reply@kcars.sk>",
          to: [notifyEmail],
          subject: `[KCars] Nový newsletter subscriber`,
          html: `<p>Nový subscriber: <strong>${email}</strong> (locale: ${locale || "sk"})</p>`,
        }),
      });
    } catch (err) {
      console.error("Newsletter notify fail:", err);
    }
  }

  return NextResponse.json({ success: true });
}
