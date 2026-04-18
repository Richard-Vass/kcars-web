"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const inputClass = "w-full bg-[#060a12] border border-white/5 rounded-xl px-4 py-3 text-sm text-[#f0f2f5] placeholder:text-[#6b7a94] focus:border-[#ef4444]/50 focus:outline-none transition-colors";
const labelClass = "text-sm text-[#94a3b8] mb-1 block";

export default function AddCarPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);

    const newImages: string[] = [];
    for (const file of Array.from(files)) {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/upload?filename=${fileName}`, {
        method: "POST",
        body: file,
      });

      if (res.ok) {
        const data = await res.json();
        newImages.push(data.url);
      }
    }

    setImages((prev) => [...prev, ...newImages]);
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const form = new FormData(e.currentTarget);

    const slug = `${form.get("brand")}-${form.get("model")}-${form.get("year")}`
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      + "-" + Math.random().toString(36).substring(2, 6);

    const car = {
      brand: form.get("brand"),
      model: form.get("model"),
      slug,
      year: Number(form.get("year")),
      price: Number(form.get("price")),
      mileage: Number(form.get("mileage")),
      fuel: form.get("fuel"),
      transmission: form.get("transmission"),
      power_kw: Number(form.get("power_kw")),
      engine_capacity: Number(form.get("engine_capacity")) || null,
      color: form.get("color") || null,
      body_type: form.get("body_type") || null,
      doors: Number(form.get("doors")) || 4,
      vin: form.get("vin") || null,
      description_sk: form.get("description_sk") || null,
      description_hu: form.get("description_hu") || null,
      description_de: form.get("description_de") || null,
      description_en: form.get("description_en") || null,
      images,
      featured: form.get("featured") === "on",
      status: form.get("status") || "available",
    };

    const res = await fetch("/api/cars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(car),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setSaving(false);
      alert("Chyba pri ukladaní");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Pridať vozidlo</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic info */}
        <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-6">
          <h2 className="text-lg font-semibold mb-4">Základné údaje</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Značka *</label>
              <input name="brand" required placeholder="napr. Škoda" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Model *</label>
              <input name="model" required placeholder="napr. Octavia Combi 2.0 TDI" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Rok výroby *</label>
              <input name="year" type="number" required placeholder="2022" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Cena (EUR) *</label>
              <input name="price" type="number" required placeholder="18900" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Najazdené (km) *</label>
              <input name="mileage" type="number" required placeholder="65000" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Výkon (kW) *</label>
              <input name="power_kw" type="number" required placeholder="110" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Technical */}
        <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-6">
          <h2 className="text-lg font-semibold mb-4">Technické údaje</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Palivo *</label>
              <select name="fuel" required className={inputClass}>
                <option value="petrol">Benzín</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Elektro</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Prevodovka *</label>
              <select name="transmission" required className={inputClass}>
                <option value="manual">Manuál</option>
                <option value="automatic">Automat</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Objem motora (cm³)</label>
              <input name="engine_capacity" type="number" placeholder="1968" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Farba</label>
              <input name="color" placeholder="Šedá" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Typ karosérie</label>
              <input name="body_type" placeholder="kombi, sedan, SUV..." className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Počet dverí</label>
              <input name="doors" type="number" defaultValue={4} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>VIN</label>
              <input name="vin" placeholder="VIN číslo" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Stav</label>
              <select name="status" className={inputClass}>
                <option value="available">Dostupné</option>
                <option value="reserved">Rezervované</option>
                <option value="sold">Predané</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input name="featured" type="checkbox" className="accent-[#ef4444] w-4 h-4" />
                <span className="text-sm text-[#94a3b8]">Odporúčané (na hlavnej)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-6">
          <h2 className="text-lg font-semibold mb-4">Fotky</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#060a12] border border-white/5">
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, 200px"
                  unoptimized
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 bg-[#ef4444] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs hover:bg-[#dc2626]"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <label className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#94a3b8] cursor-pointer hover:bg-white/10 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {uploading ? "Nahrávam..." : "Pridať fotky"}
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
          </label>
        </div>

        {/* Descriptions */}
        <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-6">
          <h2 className="text-lg font-semibold mb-4">Popisy</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Popis SK</label>
              <textarea name="description_sk" rows={3} placeholder="Popis vozidla v slovenčine..." className={inputClass + " resize-none"} />
            </div>
            <div>
              <label className={labelClass}>Popis HU</label>
              <textarea name="description_hu" rows={3} placeholder="Leírás magyarul..." className={inputClass + " resize-none"} />
            </div>
            <div>
              <label className={labelClass}>Popis DE</label>
              <textarea name="description_de" rows={3} placeholder="Beschreibung auf Deutsch..." className={inputClass + " resize-none"} />
            </div>
            <div>
              <label className={labelClass}>Popis EN</label>
              <textarea name="description_en" rows={3} placeholder="Description in English..." className={inputClass + " resize-none"} />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white font-semibold px-8 py-3 rounded-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            {saving ? "Ukladám..." : "Uložiť vozidlo"}
          </button>
          <Link href="/admin" className="bg-white/5 border border-white/10 text-[#94a3b8] font-medium px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">
            Zrušiť
          </Link>
        </div>
      </form>
    </div>
  );
}
