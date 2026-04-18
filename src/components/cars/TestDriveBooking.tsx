"use client";

/**
 * TestDriveBooking — UI-only formular pre rezervaciu skusobnej jazdy.
 * Zatial bez backendu; submit spravi simulated delay a zobrazi success.
 * Validacia client-side (email, phone, required).
 *
 * Ak mame carId v props, formular je vazany na konkretne vozidlo.
 */

import { useState, useMemo } from "react";
import type { Locale } from "@/lib/i18n";

interface Props {
  locale: Locale | string;
  carId?: string;
  carLabel?: string;
  compact?: boolean;
}

type Status = "idle" | "submitting" | "ok" | "error";

const COPY = {
  sk: {
    title: "Rezervovať skúšobnú jazdu",
    sub: "Vyberte si termín, kedy si chcete auto prísť pozrieť a vyskúšať.",
    name: "Meno a priezvisko",
    email: "E-mail",
    phone: "Telefón",
    date: "Preferovaný dátum",
    time: "Preferovaný čas",
    timeOpts: {
      placeholder: "— Vyberte —",
      morning: "Doobeda (09:00–12:00)",
      afternoon: "Poobede (13:00–16:00)",
      late: "Poobede (16:00–18:00)",
    },
    note: "Poznámka (nepovinné)",
    notePl: "Špeciálne požiadavky alebo otázky",
    gdpr: "Súhlasím so spracovaním osobných údajov podľa GDPR politiky.",
    submit: "Rezervovať jazdu",
    submitting: "...",
    success: "Ďakujeme! Čoskoro sa vám ozveme s potvrdením.",
    errorRequired: "Vyplňte prosím všetky povinné polia.",
    errorEmail: "Zadajte platný e-mail.",
    errorPhone: "Zadajte platné telefónne číslo.",
    errorGdpr: "Pre odoslanie je potrebný súhlas s GDPR.",
    forCar: "Vozidlo",
  },
  en: {
    title: "Book a test drive",
    sub: "Choose a date when you'd like to view and try the car.",
    name: "Full name",
    email: "E-mail",
    phone: "Phone",
    date: "Preferred date",
    time: "Preferred time",
    timeOpts: {
      placeholder: "— Select —",
      morning: "Morning (09:00–12:00)",
      afternoon: "Afternoon (13:00–16:00)",
      late: "Evening (16:00–18:00)",
    },
    note: "Note (optional)",
    notePl: "Special requests or questions",
    gdpr: "I consent to processing of my personal data per the GDPR policy.",
    submit: "Book drive",
    submitting: "...",
    success: "Thanks! We'll get back to you with confirmation soon.",
    errorRequired: "Please fill in all required fields.",
    errorEmail: "Enter a valid e-mail.",
    errorPhone: "Enter a valid phone number.",
    errorGdpr: "GDPR consent is required.",
    forCar: "Vehicle",
  },
  hu: {
    title: "Tesztvezetés foglalás",
    sub: "Válasszon időpontot a tesztvezetéshez.",
    name: "Név",
    email: "E-mail",
    phone: "Telefon",
    date: "Dátum",
    time: "Időpont",
    timeOpts: {
      placeholder: "— Válasszon —",
      morning: "Délelőtt (09:00–12:00)",
      afternoon: "Délután (13:00–16:00)",
      late: "Este (16:00–18:00)",
    },
    note: "Megjegyzés",
    notePl: "Egyedi kérések",
    gdpr: "Hozzájárulok a GDPR szerinti adatkezeléshez.",
    submit: "Foglalás",
    submitting: "...",
    success: "Köszönjük! Hamarosan jelentkezünk.",
    errorRequired: "Töltse ki a kötelező mezőket.",
    errorEmail: "Adjon meg egy érvényes e-mailt.",
    errorPhone: "Adjon meg érvényes telefonszámot.",
    errorGdpr: "GDPR szükséges.",
    forCar: "Jármű",
  },
  de: {
    title: "Probefahrt buchen",
    sub: "Wählen Sie einen Termin für die Probefahrt.",
    name: "Name",
    email: "E-Mail",
    phone: "Telefon",
    date: "Datum",
    time: "Uhrzeit",
    timeOpts: {
      placeholder: "— Wählen —",
      morning: "Vormittag (09:00–12:00)",
      afternoon: "Nachmittag (13:00–16:00)",
      late: "Abend (16:00–18:00)",
    },
    note: "Notiz",
    notePl: "Wünsche oder Fragen",
    gdpr: "Ich stimme der Verarbeitung gemäß DSGVO zu.",
    submit: "Buchen",
    submitting: "...",
    success: "Danke! Wir melden uns bald.",
    errorRequired: "Bitte Pflichtfelder ausfüllen.",
    errorEmail: "Gültige E-Mail eingeben.",
    errorPhone: "Gültige Telefonnummer eingeben.",
    errorGdpr: "DSGVO-Zustimmung erforderlich.",
    forCar: "Fahrzeug",
  },
} as const;

export default function TestDriveBooking({
  locale,
  carId,
  carLabel,
  compact = false,
}: Props) {
  const copy = COPY[(locale as keyof typeof COPY) in COPY ? (locale as keyof typeof COPY) : "sk"];
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") as string)?.trim();
    const email = (fd.get("email") as string)?.trim();
    const phone = (fd.get("phone") as string)?.trim();
    const date = fd.get("date") as string;
    const time = fd.get("time") as string;
    const gdpr = fd.get("gdpr") === "on";

    if (!name || !email || !phone || !date || !time) {
      setStatus("error");
      setErrorMsg(copy.errorRequired);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setErrorMsg(copy.errorEmail);
      return;
    }
    if (!/^[+0-9\s]{9,15}$/.test(phone)) {
      setStatus("error");
      setErrorMsg(copy.errorPhone);
      return;
    }
    if (!gdpr) {
      setStatus("error");
      setErrorMsg(copy.errorGdpr);
      return;
    }

    // UI-only mock (TODO: backend Supabase + email notifikacia)
    setStatus("submitting");
    await new Promise((r) => setTimeout(r, 700));
    setStatus("ok");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <div
      className={`bg-[#0c1221] border border-white/5 rounded-2xl ${
        compact ? "p-6" : "p-8"
      }`}
    >
      <h3 className="text-xl font-semibold text-white mb-2">{copy.title}</h3>
      {!compact && <p className="text-sm text-[#8b9bb4] mb-5">{copy.sub}</p>}

      {carLabel && (
        <div className="mb-5 rounded-lg bg-gradient-to-r from-[#ef4444]/10 to-[#f97316]/10 border border-[#ef4444]/30 px-4 py-3 text-sm">
          <span className="text-[#8b9bb4] mr-2">{copy.forCar}:</span>
          <span className="text-white font-medium">{carLabel}</span>
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <input type="hidden" name="carId" value={carId || ""} />

        <Field name="name" label={copy.name} required />

        <div className="grid sm:grid-cols-2 gap-4">
          <Field name="email" label={copy.email} type="email" required />
          <Field name="phone" label={copy.phone} type="tel" required />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field name="date" label={copy.date} type="date" min={minDate} required />
          <SelectField name="time" label={copy.time} required>
            <option value="">{copy.timeOpts.placeholder}</option>
            <option value="morning">{copy.timeOpts.morning}</option>
            <option value="afternoon">{copy.timeOpts.afternoon}</option>
            <option value="late">{copy.timeOpts.late}</option>
          </SelectField>
        </div>

        <div>
          <label
            htmlFor="note"
            className="block text-xs uppercase tracking-wider text-[#8b9bb4] font-semibold mb-1.5"
          >
            {copy.note}
          </label>
          <textarea
            id="note"
            name="note"
            rows={3}
            placeholder={copy.notePl}
            className="w-full rounded-xl bg-[#0c1221] border border-white/10 px-4 py-3 text-[#f0f2f5] placeholder:text-[#6b7a94] focus:border-[#ef4444]/50 focus:outline-none"
          />
        </div>

        <label className="flex items-start gap-3 text-sm text-[#cbd5e1]">
          <input
            type="checkbox"
            name="gdpr"
            className="mt-1 w-4 h-4 accent-[#ef4444]"
            required
          />
          <span>{copy.gdpr}</span>
        </label>

        {errorMsg && (
          <div
            role="alert"
            className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm p-3"
          >
            {errorMsg}
          </div>
        )}

        {status === "ok" && (
          <div
            role="status"
            className="rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-sm p-3"
          >
            {copy.success}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full bg-gradient-to-r from-[#ef4444] to-[#f97316] hover:opacity-95 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#ef4444]/20"
        >
          {status === "submitting" ? copy.submitting : copy.submit}
        </button>
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  min,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  min?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs uppercase tracking-wider text-[#8b9bb4] font-semibold mb-1.5"
      >
        {label}
        {required && <span className="text-[#ef4444] ml-0.5">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        min={min}
        placeholder={placeholder}
        pattern={type === "tel" ? "[+0-9\\s]{9,15}" : undefined}
        className="w-full rounded-xl bg-[#0c1221] border border-white/10 px-4 py-3 text-[#f0f2f5] placeholder:text-[#6b7a94] focus:border-[#ef4444]/50 focus:outline-none"
      />
    </div>
  );
}

function SelectField({
  name,
  label,
  required,
  children,
}: {
  name: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs uppercase tracking-wider text-[#8b9bb4] font-semibold mb-1.5"
      >
        {label}
        {required && <span className="text-[#ef4444] ml-0.5">*</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        className="w-full rounded-xl bg-[#0c1221] border border-white/10 px-4 py-3 text-[#f0f2f5] focus:border-[#ef4444]/50 focus:outline-none"
      >
        {children}
      </select>
    </div>
  );
}
