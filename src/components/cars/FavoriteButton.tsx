"use client";

import { useSyncExternalStore } from "react";

interface FavoriteButtonProps {
  carId: string;
  className?: string;
}

const FAV_KEY = "kcars-favorites";
const FAV_EVENT = "kcars:favorites-change";

function readFavs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(FAV_KEY) || "[]");
  } catch {
    return [];
  }
}

function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(FAV_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(FAV_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function getSnapshot(): string {
  return readFavs().join(",");
}

function getServerSnapshot(): string {
  return "";
}

export default function FavoriteButton({ carId, className = "" }: FavoriteButtonProps) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isFav = snapshot.split(",").filter(Boolean).includes(carId);

  function toggle() {
    const favs = readFavs();
    const newFavs = favs.includes(carId)
      ? favs.filter((id: string) => id !== carId)
      : [...favs, carId];
    try {
      window.localStorage.setItem(FAV_KEY, JSON.stringify(newFavs));
      window.dispatchEvent(new CustomEvent(FAV_EVENT));
    } catch {
      // ignore storage failures (private mode, etc.)
    }
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      className={`transition-all ${className}`}
      aria-label={isFav ? "Odstrániť z obľúbených" : "Pridať do obľúbených"}
    >
      <svg
        className={`w-5 h-5 transition-colors ${isFav ? "text-[#ef4444] fill-[#ef4444]" : "text-[#8b9bb4] hover:text-[#ef4444]"}`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        fill={isFav ? "currentColor" : "none"}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
}
