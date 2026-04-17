import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
  gdpr?: boolean;
  locale?: string;
  _honeypot?: string; // bot trap
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
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, phone, message, gdpr, locale, _honeypot } = body;

  // Basic validation
  if (!name || name.length < 2) {
    return NextResponse.json(
      { error: "Name is required (min 2 chars)" },
      { status: 400 }
    );
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Valid email is required" },
      { status: 400 }
    );
  }
  if (!message || message.length < 5) {
    return NextResponse.json(
      { error: "Message must be at least 5 characters" },
      { status: 400 }
    );
  }
  // GDPR consent — pre backwards compat: ak undefined, warn ale nemuss fail
  if (gdpr === false) {
    return NextResponse.json(
      { error: "GDPR consent is required" },
      { status: 400 }
    );
  }
  // Honeypot — ak bot vyplnil, tichý ok aby bot nevedel
  if (_honeypot && _honeypot.length > 0) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // Save to Supabase
  const { error: dbError } = await supabase.from("contacts").insert({
    name,
    email,
    phone: phone || null,
    message,
  });

  if (dbError) {
    console.error("Supabase contact insert error:", dbError);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  // Optional: Resend email notifikácia pre admin (vass@vassweb.com)
  // Len ak je RESEND_API_KEY v env (inak skip — neblokuje POST)
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
          subject: `[KCars] Nová správa od ${name}`,
          html: `
            <div style="font-family: Inter, sans-serif; max-width: 600px; color: #0f172a;">
              <h2 style="color: #ef4444;">Nová správa — KCars kontakt</h2>
              <p><strong>Od:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
              ${phone ? `<p><strong>Telefón:</strong> ${escapeHtml(phone)}</p>` : ""}
              <p><strong>Jazyk klienta:</strong> ${escapeHtml(locale || "sk")}</p>
              <hr style="border: 0; border-top: 1px solid #e2e8f0;" />
              <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
              <hr style="border: 0; border-top: 1px solid #e2e8f0;" />
              <p style="font-size: 12px; color: #64748b;">Prijaté ${new Date().toISOString()}</p>
            </div>
          `,
        }),
      });
    } catch (err) {
      // Neblokuj response — Supabase insert sa už podaril
      console.error("Resend notify failed (non-blocking):", err);
    }
  }

  return NextResponse.json({ success: true });
}
