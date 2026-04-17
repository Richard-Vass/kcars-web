import { supabase } from "@/lib/supabase";
import { Car, Reservation } from "@/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Paralelné dotazy do DB
  const [carsRes, resvRes] = await Promise.all([
    supabase.from("cars").select("*"),
    supabase.from("reservations").select("*"),
  ]);

  const cars = (carsRes.data || []) as Car[];
  const reservations = (resvRes.data || []) as Reservation[];

  // KPIs
  const available = cars.filter((c) => c.status === "available").length;
  const reserved = cars.filter((c) => c.status === "reserved").length;
  const sold = cars.filter((c) => c.status === "sold").length;
  const inventoryValue = cars
    .filter((c) => c.status === "available")
    .reduce((acc, c) => acc + (c.price || 0), 0);

  const newReservations = reservations.filter((r) => r.status === "new").length;
  const confirmedReservations = reservations.filter(
    (r) => r.status === "confirmed"
  ).length;

  const avgPrice =
    available > 0
      ? Math.round(
          cars
            .filter((c) => c.status === "available")
            .reduce((acc, c) => acc + (c.price || 0), 0) / available
        )
      : 0;

  const avgAge =
    available > 0
      ? Math.round(
          cars
            .filter((c) => c.status === "available")
            .reduce((acc, c) => acc + (new Date().getFullYear() - c.year), 0) /
            available
        )
      : 0;

  // Last 5 reservations
  const recentReservations = [...reservations]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  // Brand distribution
  const brandCount: Record<string, number> = {};
  cars
    .filter((c) => c.status === "available")
    .forEach((c) => {
      brandCount[c.brand] = (brandCount[c.brand] || 0) + 1;
    });
  const topBrands = Object.entries(brandCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-[#6b7a94] text-sm mt-1">
          Prehľad skladu a aktivity
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Dostupné" value={available} color="#22c55e" />
        <KpiCard label="Rezervované" value={reserved} color="#f97316" />
        <KpiCard label="Predané" value={sold} color="#ef4444" />
        <KpiCard
          label="Nové rezervácie"
          value={newReservations}
          color="#60a5fa"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Hodnota skladu"
          value={`${Math.round(inventoryValue / 1000)}k €`}
          color="#d4a843"
        />
        <KpiCard label="Priemerná cena" value={`${avgPrice.toLocaleString()} €`} />
        <KpiCard label="Priemerný vek" value={`${avgAge} r`} />
        <KpiCard
          label="Confirmed rezervácií"
          value={confirmedReservations}
          color="#22c55e"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent reservations */}
        <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Posledné rezervácie</h2>
            <Link
              href="/admin/rezervacie"
              className="text-sm text-[#6b7a94] hover:text-[#f87171]"
            >
              Všetky →
            </Link>
          </div>
          {recentReservations.length === 0 ? (
            <p className="text-[#6b7a94] text-sm">Žiadne rezervácie zatiaľ.</p>
          ) : (
            <ul className="space-y-3">
              {recentReservations.map((r) => (
                <li
                  key={r.id}
                  className="flex justify-between items-center py-2 border-b border-white/5 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-[#6b7a94]">{r.email}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-lg ${
                        r.status === "new"
                          ? "bg-[#60a5fa]/20 text-[#60a5fa]"
                          : r.status === "confirmed"
                          ? "bg-[#22c55e]/20 text-[#22c55e]"
                          : "bg-[#6b7a94]/20 text-[#6b7a94]"
                      }`}
                    >
                      {r.status}
                    </span>
                    <p className="text-xs text-[#6b7a94] mt-1">
                      {new Date(r.created_at).toLocaleDateString("sk")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Top brands */}
        <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-6">
          <h2 className="text-lg font-semibold mb-4">Top značky v sklade</h2>
          {topBrands.length === 0 ? (
            <p className="text-[#6b7a94] text-sm">Žiadne autá v sklade.</p>
          ) : (
            <div className="space-y-3">
              {topBrands.map(([brand, count]) => {
                const max = topBrands[0][1];
                const pct = Math.round((count / max) * 100);
                return (
                  <div key={brand}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{brand}</span>
                      <span className="text-[#6b7a94]">{count}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#ef4444] to-[#f97316]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8 p-6 bg-[#0c1221] rounded-2xl border border-white/5">
        <h2 className="text-lg font-semibold mb-4">Rýchle akcie</h2>
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/admin/pridat"
            className="bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white font-semibold px-4 py-2 rounded-xl"
          >
            + Pridať vozidlo
          </Link>
          <Link
            href="/admin/rezervacie"
            className="border border-white/10 px-4 py-2 rounded-xl text-sm"
          >
            Spravovať rezervácie
          </Link>
          <Link
            href="/admin"
            className="border border-white/10 px-4 py-2 rounded-xl text-sm"
          >
            Zoznam vozidiel
          </Link>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  color = "#94a3b8",
}: {
  label: string;
  value: number | string;
  color?: string;
}) {
  return (
    <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-5">
      <p className="text-xs text-[#6b7a94] uppercase tracking-wider mb-2">
        {label}
      </p>
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}
