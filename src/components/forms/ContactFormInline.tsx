"use client";

import { useState } from "react";
import { Locale } from "@/lib/i18n";

const translations: Record<string, Record<string, string>> = {
  sk: {
    title: "Máte otázku? Ozvite sa",
    sub: "Odpovedáme v rovnaký deň. Žiadny spam, len vec.",
    name: "Meno",
    email: "E-mail",
    phone: "Telefón (voliteľné)",
    message: "Správa",
    gdpr: "Súhlasím so spracovaním osobných údajov",
    submit: "Poslať správu",
    sending: "Odosielam...",
    ok_title: "Ďakujeme!",
    ok_text: "Odpovedáme do 24 hodín.",
    err: "Niečo sa pokazilo. Skúste znova alebo zavolajte.",
  },
  cs: {
    title: "Máte otázku? Ozvěte se",
    sub: "Odpovídáme ve stejný den. Žádný spam, jen věc.",
    name: "Jméno", email: "E-mail", phone: "Telefon (volitelné)",
    message: "Zpráva", gdpr: "Souhlasím se zpracováním osobních údajů",
    submit: "Odeslat zprávu", sending: "Odesílám...",
    ok_title: "Děkujeme!", ok_text: "Odpovídáme do 24 hodin.",
    err: "Něco se pokazilo. Zkuste znovu nebo zavolejte.",
  },
  hu: {
    title: "Van kérdése? Írjon nekünk",
    sub: "Aznap válaszolunk. Semmi spam, csak a lényeg.",
    name: "Név", email: "E-mail", phone: "Telefon (opcionális)",
    message: "Üzenet", gdpr: "Elfogadom a személyes adatok kezelését",
    submit: "Üzenet küldése", sending: "Küldés...",
    ok_title: "Köszönjük!", ok_text: "24 órán belül válaszolunk.",
    err: "Valami hiba történt. Próbálja újra vagy hívjon.",
  },
  de: {
    title: "Eine Frage? Schreiben Sie uns",
    sub: "Wir antworten am selben Tag. Kein Spam, nur zur Sache.",
    name: "Name", email: "E-mail", phone: "Telefon (optional)",
    message: "Nachricht", gdpr: "Ich stimme der Verarbeitung meiner Daten zu",
    submit: "Nachricht senden", sending: "Wird gesendet...",
    ok_title: "Danke!", ok_text: "Wir antworten innerhalb 24 Stunden.",
    err: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
  },
  en: {
    title: "Have a question? Let's talk",
    sub: "We reply the same day. No spam, just value.",
    name: "Name", email: "E-mail", phone: "Phone (optional)",
    message: "Message", gdpr: "I consent to the processing of my personal data",
    submit: "Send message", sending: "Sending...",
    ok_title: "Thank you!", ok_text: "We'll reply within 24 hours.",
    err: "Something went wrong. Please try again or call us.",
  },
};

interface Props {
  locale: Locale;
  compact?: boolean;
}

export default function ContactFormInline({ locale, compact = false }: Props) {
  const t = translations[locale] || translations.en;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    gdpr: false,
    _honeypot: "",
  });
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [errText, setErrText] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setErrText("");
    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Request failed");
      }
      setState("ok");
      setForm({ name: "", email: "", phone: "", message: "", gdpr: false, _honeypot: "" });
    } catch (err) {
      setState("err");
      setErrText(err instanceof Error ? err.message : String(err));
    }
  }

  if (state === "ok") {
    return (
      <div className={`${compact ? "p-6" : "p-10"} bg-[#0c1221] border border-[#22c55e]/30 rounded-2xl text-center`}>
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#22c55e]/20 flex items-center justify-center text-[#22c55e] text-2xl">
          ✓
        </div>
        <h3 className="text-xl font-bold text-[#f0f2f5] mb-2">{t.ok_title}</h3>
        <p className="text-[#94a3b8] text-sm">{t.ok_text}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`${compact ? "p-6" : "p-8 md:p-10"} bg-[#0c1221] border border-white/5 rounded-2xl space-y-4`}
    >
      {!compact && (
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-[#f0f2f5] mb-2">{t.title}</h3>
          <p className="text-sm text-[#94a3b8]">{t.sub}</p>
        </div>
      )}

      {/* Honeypot — skryté pole, bot ho vyplní, user nie */}
      <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
        <label>
          Do not fill this field:
          <input
            type="text"
            name="_honeypot"
            tabIndex={-1}
            autoComplete="off"
            value={form._honeypot}
            onChange={(e) => setForm({ ...form, _honeypot: e.target.value })}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[#6b7a94] uppercase tracking-wider mb-1.5">
            {t.name} *
          </label>
          <input
            type="text"
            required
            minLength={2}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-[#060a12] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#f0f2f5] focus:outline-none focus:border-[#ef4444] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-[#6b7a94] uppercase tracking-wider mb-1.5">
            {t.email} *
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-[#060a12] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#f0f2f5] focus:outline-none focus:border-[#ef4444] transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs text-[#6b7a94] uppercase tracking-wider mb-1.5">
          {t.phone}
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full bg-[#060a12] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#f0f2f5] focus:outline-none focus:border-[#ef4444] transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs text-[#6b7a94] uppercase tracking-wider mb-1.5">
          {t.message} *
        </label>
        <textarea
          required
          minLength={5}
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full bg-[#060a12] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-[#f0f2f5] focus:outline-none focus:border-[#ef4444] transition-colors resize-vertical"
        />
      </div>
      <label className="flex items-start gap-2 text-sm text-[#94a3b8]">
        <input
          type="checkbox"
          required
          checked={form.gdpr}
          onChange={(e) => setForm({ ...form, gdpr: e.target.checked })}
          className="mt-0.5 w-4 h-4 flex-shrink-0"
        />
        <span>{t.gdpr}</span>
      </label>

      {state === "err" && errText && (
        <div className="text-sm text-[#ef4444]">{errText || t.err}</div>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="w-full bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white font-semibold py-3 rounded-xl hover:-translate-y-0.5 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {state === "sending" ? t.sending : t.submit}
      </button>
    </form>
  );
}
