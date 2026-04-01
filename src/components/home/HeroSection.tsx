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
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video background — placeholder until real video is added */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-800">
        {/* When video is ready, uncomment: */}
        {/* <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video> */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Decorative car silhouette lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/10 to-transparent translate-y-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
          {t.hero.title}
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-white/70 max-w-2xl mx-auto">
          {t.hero.subtitle}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}/ponuka`}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all hover:scale-105"
          >
            {t.hero.cta}
          </Link>
          <Link
            href={`/${locale}/kontakt`}
            className="border border-white/30 hover:border-white/60 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all hover:bg-white/5"
          >
            {t.hero.ctaSecondary}
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-white/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
