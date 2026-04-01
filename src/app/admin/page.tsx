import { supabase } from "@/lib/supabase";
import { Car } from "@/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { data } = await supabase
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false });

  const cars = (data || []) as Car[];

  const statusColors: Record<string, string> = {
    available: "bg-[#22c55e]/20 text-[#22c55e]",
    reserved: "bg-[#f97316]/20 text-[#f97316]",
    sold: "bg-[#ef4444]/20 text-[#ef4444]",
  };

  const statusLabels: Record<string, string> = {
    available: "Dostupné",
    reserved: "Rezervované",
    sold: "Predané",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Vozidlá</h1>
          <p className="text-[#6b7a94] text-sm mt-1">{cars.length} vozidiel v databáze</p>
        </div>
        <Link
          href="/admin/pridat"
          className="bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white font-semibold px-5 py-2.5 rounded-xl hover:-translate-y-0.5 transition-all"
        >
          + Pridať vozidlo
        </Link>
      </div>

      <div className="bg-[#0c1221] rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-xs text-[#6b7a94] font-medium uppercase tracking-wider px-6 py-4">Vozidlo</th>
              <th className="text-left text-xs text-[#6b7a94] font-medium uppercase tracking-wider px-6 py-4">Rok</th>
              <th className="text-left text-xs text-[#6b7a94] font-medium uppercase tracking-wider px-6 py-4">Cena</th>
              <th className="text-left text-xs text-[#6b7a94] font-medium uppercase tracking-wider px-6 py-4">Km</th>
              <th className="text-left text-xs text-[#6b7a94] font-medium uppercase tracking-wider px-6 py-4">Stav</th>
              <th className="text-left text-xs text-[#6b7a94] font-medium uppercase tracking-wider px-6 py-4">AB.eu</th>
              <th className="text-right text-xs text-[#6b7a94] font-medium uppercase tracking-wider px-6 py-4">Akcie</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-[#f0f2f5]">{car.brand} {car.model}</p>
                    <p className="text-xs text-[#6b7a94] mt-0.5">{car.fuel} / {car.transmission}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#94a3b8]">{car.year}</td>
                <td className="px-6 py-4 text-sm font-semibold text-[#f87171]">{car.price.toLocaleString()} €</td>
                <td className="px-6 py-4 text-sm text-[#94a3b8]">{car.mileage.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${statusColors[car.status]}`}>
                    {statusLabels[car.status]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {car.autobazar_eu_id ? (
                    <span className="text-xs text-[#22c55e]">Synced</span>
                  ) : (
                    <span className="text-xs text-[#6b7a94]">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/upravit/${car.id}`}
                    className="text-sm text-[#6b7a94] hover:text-[#f87171] transition-colors"
                  >
                    Upraviť
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
