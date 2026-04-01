"use client";

import { useState } from "react";

interface ContactFormProps {
  t: {
    contact: {
      name: string;
      email: string;
      phone: string;
      message: string;
      submit: string;
      success: string;
      error: string;
    };
  };
}

export default function ContactForm({ t }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/kontakt", {
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
        <p className="text-green-400 font-medium">{t.contact.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        required
        placeholder={t.contact.name}
        className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          name="email"
          type="email"
          required
          placeholder={t.contact.email}
          className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
        />
        <input
          name="phone"
          type="tel"
          placeholder={t.contact.phone}
          className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
        />
      </div>
      <textarea
        name="message"
        required
        rows={5}
        placeholder={t.contact.message}
        className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none resize-none"
      />

      {status === "error" && (
        <p className="text-red-400 text-sm">{t.contact.error}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {status === "loading" ? "..." : t.contact.submit}
      </button>
    </form>
  );
}
