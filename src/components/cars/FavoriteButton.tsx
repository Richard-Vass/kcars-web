"use client";

import { useState, useEffect } from "react";

interface FavoriteButtonProps {
  carId: string;
  className?: string;
}

export default function FavoriteButton({ carId, className = "" }: FavoriteButtonProps) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("kcars-favorites") || "[]");
    setIsFav(favs.includes(carId));
  }, [carId]);

  function toggle() {
    const favs = JSON.parse(localStorage.getItem("kcars-favorites") || "[]");
    let newFavs;
    if (favs.includes(carId)) {
      newFavs = favs.filter((id: string) => id !== carId);
    } else {
      newFavs = [...favs, carId];
    }
    localStorage.setItem("kcars-favorites", JSON.stringify(newFavs));
    setIsFav(!isFav);
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
