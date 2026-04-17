import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

interface ReservationPayload {
  car_id: string;
  name: string;
  email: string;
  phone: string;
  preferred_date?: string;
  message?: string;
  gdpr?: boolean;
  _honeypot?: string;
}

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: NextRequest) {
  let body: ReservationPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { car_id, name, email, phone, preferred_date, message, gdpr, _honeypot } = body;

  // Validation
  if (!car_id) {
    return NextResponse.json({ error: "car_id is required" }, { status: 400 });
  }
  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  if (!phone || phone.length < 6) {
    return NextResponse.json({ error: "Phone is required" }, { status: 400 });
  }
  if (gdpr === false) {
    return NextResponse.json({ error: "GDPR consent is required" }, { status: 400 });
  }
  if (_honeypot && _honeypot.length > 0) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // Save to Supabase
  const { error } = await supabase.from("reservations").insert({
    car_id,
    name,
    email,
    phone,
    preferred_date: preferred_date || null,
    message: message || null,
  });

  if (error) {
    console.error("Supabase reservation insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch car info for email
  const { data: car } = await supabase
    .from("cars")
    .select("brand, model, year, price, slug")
    .eq("id", car_id)
    .single();

  // Optional: Resend notifikácia
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
          reply_to: email,
          subject: `[KCars] Nová rezervácia — ${car ? `${car.brand} ${car.model}` : "auto"}`,
          html: `
            <div style="font-family: Inter, sans-serif; max-width: 600px; color: #0f172a;">
              <h2 style="color: #ef4444;">Nová rezervácia</h2>
              <p><strong>Zákazník:</strong> ${escapeHtml(name)}</p>
              <p><strong>E-mail:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
              <p><strong>Telefón:</strong> <a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></p>
              ${preferred_date ? `<p><strong>Preferovaný termín:</strong> ${escapeHtml(preferred_date)}</p>` : ""}
              ${car ? `
                <hr style="border: 0; border-top: 1px solid #e2e8f0;" />
                <p><strong>Auto:</strong> ${escapeHtml(car.brand)} ${escapeHtml(car.model)} (${car.year})</p>
                <p><strong>Cena:</strong> ${car.price?.toLocaleString()} €</p>
              ` : ""}
              ${message ? `
                <hr style="border: 0; border-top: 1px solid #e2e8f0;" />
                <p><strong>Správa:</strong></p>
                <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
              ` : ""}
              <hr style="border: 0; border-top: 1px solid #e2e8f0;" />
              <p style="font-size: 12px; color: #64748b;">Prijaté ${new Date().toISOString()}</p>
            </div>
          `,
        }),
      });
    } catch (err) {
      console.error("Resend notify failed (non-blocking):", err);
    }
  }

  return NextResponse.json({ success: true });
}
