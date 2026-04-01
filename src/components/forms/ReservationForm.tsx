"use client";

import { useState } from "react";

interface ReservationFormProps {
  carId: string;
  t: {
    reservation: {
      title: string;
      name: string;
      email: string;
      phone: string;
      date: string;
      message: string;
      submit: string;
      success: string;
      error: string;
    };
  };
}

export default function ReservationForm({ carId, t }: ReservationFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = {
      car_id: carId,
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      preferred_date: formData.get("preferred_date"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/rezervacia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
        <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <p className="text-green-400 font-medium">{t.reservation.success}</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-xl border border-white/10 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{t.reservation.title}</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          required
          placeholder={t.reservation.name}
          className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="email"
            type="email"
            required
            placeholder={t.reservation.email}
            className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
          />
          <input
            name="phone"
            type="tel"
            required
            placeholder={t.reservation.phone}
            className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
          />
        </div>
        <input
          name="preferred_date"
          type="date"
          placeholder={t.reservation.date}
          className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
        />
        <textarea
          name="message"
          rows={3}
          placeholder={t.reservation.message}
          className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none resize-none"
        />

        {status === "error" && (
          <p className="text-red-400 text-sm">{t.reservation.error}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {status === "loading" ? "..." : t.reservation.submit}
        </button>
      </form>
    </div>
  );
}
