"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";

const CONSENT_KEY = "kcars-cookie-consent";
const CONSENT_EVENT = "kcars:consent-change";

function readConsent(): boolean {
  if (typeof window === "undefined") return true; // default: hide on SSR
  try {
    return !!window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return true;
  }
}

function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CONSENT_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CONSENT_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function getSnapshot(): string {
  return readConsent() ? "1" : "0";
}

function getServerSnapshot(): string {
  // pretend consented on server, banner appears only after hydration
  return "1";
}

export default function CookieBanner() {
  const consented = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) === "1";
  const [dismissed, setDismissed] = useState(false);

  function accept() {
    try {
      window.localStorage.setItem(CONSENT_KEY, "accepted");
      window.dispatchEvent(new CustomEvent(CONSENT_EVENT));
    } catch {
      // ignore
    }
    setDismissed(true);
  }

  if (consented || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-[#0c1221]/95 backdrop-blur-xl border-t border-white/10 px-4 py-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[#94a3b8] text-center sm:text-left">
          Táto webová stránka používa cookies k zlepšeniu používateľskej skúsenosti. Používaním tejto stránky súhlasíte s{" "}
          <Link href="/sk/cookies" className="text-[#f87171] hover:underline">
            politikou cookies
          </Link>.
        </p>
        <button
          onClick={accept}
          className="bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white font-semibold px-6 py-2 rounded-xl text-sm hover:-translate-y-0.5 transition-all whitespace-nowrap"
        >
          Súhlasím
        </button>
      </div>
    </div>
  );
}
