"use client";

import { useState } from "react";
import { Locale } from "@/lib/i18n";

const translations: Record<string, Record<string, string>> = {
  sk: {
    title: "Nové autá každý týždeň",
    sub: "Ako prví dostanete zoznam nových vozidiel priamo do e-mailu.",
    ph: "Váš e-mail",
    submit: "Odoberať",
    sending: "...",
    ok: "Skvelé! Čoskoro sa ozveme.",
    err: "Niečo sa pokazilo",
    gdpr: "Odoslaním súhlasíte so spracovaním e-mailu podľa GDPR.",
  },
  cs: { title: "Nová auta každý týden", sub: "Jako první dostanete seznam nových vozidel.", ph: "Váš e-mail", submit: "Odebírat", sending: "...", ok: "Skvělé! Brzy se ozveme.", err: "Něco se pokazilo", gdpr: "Odesláním souhlasíte se zpracováním e-mailu podle GDPR." },
  hu: { title: "Új autók minden héten", sub: "Elsőként kap értesítést az új járművekről.", ph: "Az Ön e-mailje", submit: "Feliratkozás", sending: "...", ok: "Nagyszerű! Hamarosan jelentkezünk.", err: "Valami hiba történt", gdpr: "Elküldéssel hozzájárul az e-mail GDPR szerinti kezeléséhez." },
  de: { title: "Neue Autos jeden Woche", sub: "Erhalten Sie als Erster die Liste neuer Fahrzeuge.", ph: "Ihre E-Mail", submit: "Abonnieren", sending: "...", ok: "Super! Wir melden uns bald.", err: "Etwas ist schiefgelaufen", gdpr: "Mit dem Absenden stimmen Sie der Verarbeitung Ihrer E-Mail nach GDPR zu." },
  en: { title: "New cars every week", sub: "Be the first to get the list of new vehicles in your inbox.", ph: "Your e-mail", submit: "Subscribe", sending: "...", ok: "Great! We'll be in touch soon.", err: "Something went wrong", gdpr: "By submitting, you agree to GDPR processing of your e-mail." },
};

interface Props {
  locale: Locale;
  variant?: "inline" | "footer";
}

export default function NewsletterSignup({ locale, variant = "inline" }: Props) {
  const t = translations[locale] || translations.en;
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypot) {
      // bot — tiché success
      setState("ok");
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("err");
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      if (!res.ok) throw new Error();
      setState("ok");
      setEmail("");
    } catch {
      setState("err");
    }
  }

  if (variant === "footer") {
    return (
      <form onSubmit={submit} className="w-full max-w-sm">
        <p className="text-sm text-[#94a3b8] mb-3">{t.sub}</p>
        <div className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.ph}
            className="flex-1 bg-[#060a12] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#f0f2f5] focus:border-[#ef4444] outline-none"
          />
          <input
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            aria-hidden="true"
            autoComplete="off"
            style={{ position: "absolute", left: "-9999px" }}
          />
          <button
            type="submit"
            disabled={state === "sending"}
            className="bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-60"
          >
            {state === "sending" ? t.sending : t.submit}
          </button>
        </div>
        {state === "ok" && <p className="text-xs text-[#4ade80] mt-2">{t.ok}</p>}
        {state === "err" && <p className="text-xs text-[#ef4444] mt-2">{t.err}</p>}
      </form>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-[#ef4444]/10 to-[#f97316]/5 border-t border-b border-white/5">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#f0f2f5] mb-3">
          {t.title}
        </h2>
        <p className="text-[#94a3b8] mb-8">{t.sub}</p>
        <form onSubmit={submit} className="flex gap-3 flex-wrap justify-center">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.ph}
            className="flex-1 min-w-[240px] bg-[#060a12] border border-white/10 rounded-xl px-4 py-3 text-[#f0f2f5] focus:border-[#ef4444] outline-none"
          />
          <input
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            aria-hidden="true"
            autoComplete="off"
            style={{ position: "absolute", left: "-9999px" }}
          />
          <button
            type="submit"
            disabled={state === "sending"}
            className="bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white font-semibold px-6 py-3 rounded-xl hover:-translate-y-0.5 transition-transform disabled:opacity-60"
          >
            {state === "sending" ? t.sending : t.submit}
          </button>
        </form>
        {state === "ok" && (
          <p className="text-sm text-[#4ade80] mt-4">{t.ok}</p>
        )}
        {state === "err" && (
          <p className="text-sm text-[#ef4444] mt-4">{t.err}</p>
        )}
        <p className="text-xs text-[#6b7a94] mt-6">{t.gdpr}</p>
      </div>
    </section>
  );
}
