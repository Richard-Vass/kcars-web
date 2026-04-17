"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function PonukaError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Ponuka error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#f0f2f5] mb-4">
          Ponuka sa nepodarila načítať
        </h2>
        <p className="text-[#94a3b8] mb-8">
          Skúste obnoviť stránku. Ak problém pretrváva, napíšte nám.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => reset()}
            className="bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white font-semibold px-5 py-2.5 rounded-xl"
          >
            Skúsiť znova
          </button>
          <Link
            href="/kontakt"
            className="border border-white/10 px-5 py-2.5 rounded-xl text-[#94a3b8] hover:text-white"
          >
            Kontakt
          </Link>
        </div>
      </div>
    </div>
  );
}
