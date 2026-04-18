"use client";

/**
 * CompareCars — UI pre porovnanie max 3 vozidiel.
 * Ukladame IDs v localStorage pod klucom kcars_compare.
 * Komponent ma dve formy:
 *  - Toggle button (add/remove from compare)
 *  - CompareTable (zobrazi vybrane auta vedla seba)
 */

import { useState, useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Car } from "@/types";
import type { Locale } from "@/lib/i18n";

const STORAGE_KEY = "kcars_compare";
const COMPARE_EVENT = "kcars:compare-change";
const MAX_COMPARE = 3;

const COPY = {
  sk: {
    add: "Pridať k porovnaniu",
    added: "V porovnaní",
    remove: "Odstrániť",
    compareCta: "Porovnať",
    fullMsg: "Maximálne 3 vozidlá",
    empty: "Pridajte vozidlá k porovnaniu z ponuky",
    title: "Porovnanie vozidiel",
    close: "Zavrieť",
    year: "Rok",
    mileage: "Najazdené",
    power: "Výkon",
    fuel: "Palivo",
    transmission: "Prevodovka",
    doors: "Počet dverí",
    engine: "Objem motora",
    color: "Farba",
    price: "Cena",
    detail: "Detail vozidla",
  },
  en: {
    add: "Add to compare",
    added: "In compare",
    remove: "Remove",
    compareCta: "Compare",
    fullMsg: "Max 3 vehicles",
    empty: "Add vehicles to compare from the listings",
    title: "Vehicle comparison",
    close: "Close",
    year: "Year",
    mileage: "Mileage",
    power: "Power",
    fuel: "Fuel",
    transmission: "Transmission",
    doors: "Doors",
    engine: "Engine",
    color: "Colour",
    price: "Price",
    detail: "Vehicle detail",
  },
  hu: {
    add: "Összehasonlításhoz",
    added: "Összehasonlításban",
    remove: "Eltávolítás",
    compareCta: "Összehasonlítás",
    fullMsg: "Max 3 jármű",
    empty: "Adjon hozzá járműveket",
    title: "Összehasonlítás",
    close: "Bezár",
    year: "Év",
    mileage: "Km",
    power: "Teljesítmény",
    fuel: "Üzemanyag",
    transmission: "Váltó",
    doors: "Ajtó",
    engine: "Motor",
    color: "Szín",
    price: "Ár",
    detail: "Részletek",
  },
  de: {
    add: "Zum Vergleich",
    added: "Im Vergleich",
    remove: "Entfernen",
    compareCta: "Vergleichen",
    fullMsg: "Max 3 Fahrzeuge",
    empty: "Fahrzeuge hinzufügen",
    title: "Fahrzeugvergleich",
    close: "Schließen",
    year: "Jahr",
    mileage: "km",
    power: "Leistung",
    fuel: "Kraftstoff",
    transmission: "Getriebe",
    doors: "Türen",
    engine: "Hubraum",
    color: "Farbe",
    price: "Preis",
    detail: "Details",
  },
} as const;

function readCompare(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeCompare(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.slice(0, MAX_COMPARE)));
    window.dispatchEvent(new CustomEvent(COMPARE_EVENT));
  } catch {
    // ignore
  }
}

function subscribeCompare(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(COMPARE_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(COMPARE_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function getCompareSnapshot(): string {
  return readCompare().join(",");
}

function getServerCompareSnapshot(): string {
  return "";
}

export function useCompareIds() {
  const snapshot = useSyncExternalStore(
    subscribeCompare,
    getCompareSnapshot,
    getServerCompareSnapshot
  );
  const ids = snapshot ? snapshot.split(",").filter(Boolean) : [];

  const toggle = useCallback((id: string) => {
    const current = readCompare();
    if (current.includes(id)) {
      writeCompare(current.filter((x) => x !== id));
    } else if (current.length < MAX_COMPARE) {
      writeCompare([...current, id]);
    }
  }, []);

  const remove = useCallback((id: string) => {
    writeCompare(readCompare().filter((x) => x !== id));
  }, []);

  const clear = useCallback(() => {
    writeCompare([]);
  }, []);

  return { ids, toggle, remove, clear, max: MAX_COMPARE };
}

export function CompareToggleButton({
  carId,
  locale = "sk",
  className,
}: {
  carId: string;
  locale?: Locale | string;
  className?: string;
}) {
  const { ids, toggle, max } = useCompareIds();
  const isIn = ids.includes(carId);
  const isFull = !isIn && ids.length >= max;
  const copy = COPY[(locale as keyof typeof COPY) in COPY ? (locale as keyof typeof COPY) : "sk"];

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isFull) toggle(carId);
      }}
      disabled={isFull}
      aria-pressed={isIn}
      title={isFull ? copy.fullMsg : isIn ? copy.remove : copy.add}
      className={
        className ||
        `text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
          isIn
            ? "bg-[#ef4444]/10 border-[#ef4444]/40 text-[#fca5a5]"
            : isFull
            ? "border-white/10 text-[#6b7a94] cursor-not-allowed"
            : "border-white/15 text-[#cbd5e1] hover:border-[#ef4444]/40 hover:text-[#fca5a5]"
        }`
      }
    >
      {isIn ? "✓ " + copy.added : "⇆ " + copy.add}
    </button>
  );
}

export function CompareFloatingBar({
  locale = "sk",
  cars,
}: {
  locale?: Locale | string;
  /** Lookup map: pass pole vsetkych znalych aut, CompareFloatingBar si vyfiltruje vybrane */
  cars: Car[];
}) {
  const { ids, remove, clear } = useCompareIds();
  const [open, setOpen] = useState(false);
  const copy = COPY[(locale as keyof typeof COPY) in COPY ? (locale as keyof typeof COPY) : "sk"];

  const selected = cars.filter((c) => ids.includes(c.id));
  if (ids.length === 0) return null;

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 bg-gradient-to-r from-[#ef4444] to-[#f97316] hover:opacity-90 text-white font-semibold px-5 py-3 rounded-full shadow-2xl shadow-[#ef4444]/30 flex items-center gap-2"
      >
        <span>⇆ {copy.compareCta}</span>
        <span className="bg-white/20 rounded-full text-xs px-2 py-0.5">
          {ids.length}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={copy.title}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 md:p-8 overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-w-6xl mx-auto bg-[#0c1221] border border-white/10 rounded-2xl p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-2xl text-white">{copy.title}</h2>
              <div className="flex gap-3">
                <button
                  onClick={clear}
                  className="text-sm text-[#8b9bb4] hover:text-white"
                >
                  {copy.remove}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white/80 hover:text-white"
                  aria-label={copy.close}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr>
                    <th className="text-left text-xs uppercase text-[#8b9bb4] font-medium py-2 pr-4"></th>
                    {selected.map((c) => (
                      <th key={c.id} className="text-left py-2 pr-4 align-top">
                        <div className="bg-[#111a2e] rounded-xl p-4">
                          {c.images?.[0] ? (
                            <div className="aspect-[16/10] mb-2 rounded-lg overflow-hidden bg-[#0c1221] relative">
                              <Image
                                src={c.images[0]}
                                alt={`${c.brand} ${c.model}`}
                                fill
                                sizes="(max-width: 768px) 50vw, 200px"
                                className="object-cover"
                              />
                            </div>
                          ) : null}
                          <div className="text-xs text-[#8b9bb4]">{c.brand}</div>
                          <div className="font-semibold text-white mt-0.5">
                            {c.brand} {c.model}
                          </div>
                          <div className="mt-2 font-bold bg-gradient-to-r from-[#ef4444] to-[#f97316] bg-clip-text text-transparent">
                            {c.price.toLocaleString()} €
                          </div>
                          <div className="mt-3 flex gap-2">
                            <Link
                              href={`/${locale}/ponuka/${c.slug}`}
                              className="text-xs border border-white/10 hover:border-[#ef4444]/40 text-[#cbd5e1] hover:text-white px-3 py-1 rounded"
                            >
                              {copy.detail}
                            </Link>
                            <button
                              onClick={() => remove(c.id)}
                              className="text-xs text-red-400 hover:text-red-300"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-[#cbd5e1] text-sm">
                  <Row label={copy.year} values={selected.map((c) => String(c.year))} />
                  <Row label={copy.mileage} values={selected.map((c) => `${c.mileage.toLocaleString()} km`)} />
                  <Row label={copy.power} values={selected.map((c) => `${c.power_kw} kW`)} />
                  <Row label={copy.fuel} values={selected.map((c) => c.fuel)} />
                  <Row label={copy.transmission} values={selected.map((c) => c.transmission)} />
                  <Row label={copy.engine} values={selected.map((c) => `${c.engine_capacity} cm³`)} />
                  <Row label={copy.doors} values={selected.map((c) => String(c.doors))} />
                  <Row label={copy.color} values={selected.map((c) => c.color)} />
                  <Row
                    label={copy.price}
                    values={selected.map((c) => `${c.price.toLocaleString()} €`)}
                    highlight
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Row({
  label,
  values,
  highlight,
}: {
  label: string;
  values: string[];
  highlight?: boolean;
}) {
  return (
    <tr className="border-t border-white/5">
      <td className="py-3 pr-4 text-xs uppercase tracking-wider text-[#8b9bb4] whitespace-nowrap">
        {label}
      </td>
      {values.map((v, i) => (
        <td
          key={i}
          className={`py-3 pr-4 ${
            highlight ? "font-bold text-white text-base" : ""
          }`}
        >
          {v || "—"}
        </td>
      ))}
    </tr>
  );
}
