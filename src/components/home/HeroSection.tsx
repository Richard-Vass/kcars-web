import Link from "next/link";
import { Locale } from "@/lib/i18n";

interface HeroSectionProps {
  locale: Locale;
  t: {
    hero: {
      title: string;
      subtitle: string;
      cta: string;
      ctaSecondary: string;
    };
  };
}

export default function HeroSection({ locale, t }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#060a12]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#060a12] via-[#0c1221] to-[#060a12]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ef4444] to-transparent opacity-40" />
      </div>

      {/* Giant logo in background with fire gradient */}
      <div className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none">
        {/* Blurred glow layer */}
        <div
          className="absolute w-[900px] h-[560px] lg:w-[1100px] lg:h-[680px] right-[-80px] lg:right-[-20px] top-1/2 -translate-y-1/2 blur-[80px]"
          style={{
            background: "linear-gradient(135deg, rgba(239,68,68,0.4), rgba(249,115,22,0.3), rgba(239,68,68,0.2))",
            WebkitMaskImage: "url(/images/logo.png)",
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskImage: "url(/images/logo.png)",
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
          }}
        />
        {/* Sharp gradient logo */}
        <div
          className="absolute w-[900px] h-[560px] lg:w-[1100px] lg:h-[680px] right-[-80px] lg:right-[-20px] top-1/2 -translate-y-1/2"
          style={{
            background: "linear-gradient(135deg, #ef4444 0%, #f97316 40%, #ef4444 70%, #f87171 100%)",
            opacity: 0.25,
            WebkitMaskImage: "url(/images/logo.png)",
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskImage: "url(/images/logo.png)",
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
          }}
        />
      </div>

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-0.5 h-0.5 bg-[#ef4444]/30 rounded-full animate-pulse" />
        <div className="absolute top-[60%] left-[80%] w-0.5 h-0.5 bg-[#ef4444]/20 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-[40%] left-[50%] w-0.5 h-0.5 bg-[#3b82f6]/20 rounded-full animate-pulse delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 pt-[76px]">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-0.5 bg-gradient-to-r from-[#ef4444] to-[#f97316] rounded-full" />
            <span className="text-xs font-semibold uppercase tracking-[2px] text-[#f87171]">
              {locale === "sk" ? "Prémiové vozidlá" : locale === "hu" ? "Prémium járművek" : locale === "de" ? "Premium Fahrzeuge" : "Premium Vehicles"}
            </span>
          </div>

          <h1 className="text-[clamp(3rem,5.5vw,4.8rem)] font-black leading-[1.02] mb-7 tracking-[-2px]" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
            {t.hero.title.split(" ").map((word, i) => (
              <span key={i}>
                {i < 3 ? (
                  <span className="bg-gradient-to-r from-[#ef4444] to-[#f97316] bg-clip-text text-transparent">{word} </span>
                ) : (
                  <span>{word} </span>
                )}
              </span>
            ))}
          </h1>

          <p className="text-lg text-[#94a3b8] max-w-[460px] mb-10 leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="flex gap-4 flex-wrap mb-12">
            <Link
              href={`/${locale}/ponuka`}
              className="bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white font-semibold px-8 py-4 rounded-[20px] text-base shadow-[0_4px_24px_rgba(239,68,68,0.3)] hover:shadow-[0_12px_36px_rgba(239,68,68,0.4)] hover:-translate-y-1 transition-all inline-flex items-center gap-2"
            >
              {t.hero.cta}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href={`/${locale}/kontakt`}
              className="bg-white/5 border border-white/[0.08] backdrop-blur-xl text-[#f0f2f5] font-semibold px-8 py-4 rounded-[20px] text-base hover:bg-white/10 hover:border-white/15 hover:-translate-y-0.5 transition-all"
            >
              {t.hero.ctaSecondary}
            </Link>
          </div>

          {/* Trust items */}
          <div className="flex gap-8 pt-6 border-t border-white/5">
            {[
              locale === "sk" ? "Overené vozidlá" : locale === "hu" ? "Ellenőrzött járművek" : locale === "de" ? "Geprüfte Fahrzeuge" : "Verified vehicles",
              locale === "sk" ? "Záruka na každé auto" : locale === "hu" ? "Garancia minden autóra" : locale === "de" ? "Garantie auf jedes Auto" : "Warranty on every car",
              locale === "sk" ? "Férové ceny" : locale === "hu" ? "Tisztességes árak" : locale === "de" ? "Faire Preise" : "Fair prices",
            ].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-md flex items-center justify-center">
                  <svg className="w-3 h-3 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[0.82rem] text-[#6b7a94] font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-5 h-5 text-[#6b7a94]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
