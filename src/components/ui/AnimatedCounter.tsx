"use client";

import { useState, useEffect, useRef } from "react";

interface AnimatedCounterProps {
  value: string; // e.g. "500+", "98%", "12+"
  className?: string;
}

export default function AnimatedCounter({ value, className = "" }: AnimatedCounterProps) {
  const [displayed, setDisplayed] = useState("0");
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Parse numeric part
  const numMatch = value.match(/(\d+)/);
  const target = numMatch ? parseInt(numMatch[1]) : 0;
  const suffix = value.replace(/\d+/, "");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const duration = 1500;
    const steps = 40;
    const stepTime = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const progress = current / steps;
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const num = Math.round(target * eased);
      setDisplayed(String(num));

      if (current >= steps) {
        setDisplayed(String(target));
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [started, target]);

  return (
    <span ref={ref} className={className}>
      {displayed}{suffix}
    </span>
  );
}
