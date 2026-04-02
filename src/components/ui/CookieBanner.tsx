"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("kcars-cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("kcars-cookie-consent", "accepted");
    setVisible(false);
  }

  if (!visible) return null;

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
