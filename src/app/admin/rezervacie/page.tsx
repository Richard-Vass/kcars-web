import { supabase } from "@/lib/supabase";
import { Reservation, Car } from "@/types";

export const dynamic = "force-dynamic";

interface ReservationWithCar extends Reservation {
  car?: Pick<Car, "id" | "brand" | "model" | "year"> | null;
}

export default async function AdminReservationsPage() {
  // Fetch rezervácií + základných údajov auta cez join
  const { data: resvData } = await supabase
    .from("reservations")
    .select("*, car:cars(id, brand, model, year)")
    .order("created_at", { ascending: false });

  const reservations = (resvData || []) as ReservationWithCar[];

  const statusColors: Record<string, string> = {
    new: "bg-[#60a5fa]/20 text-[#60a5fa]",
    confirmed: "bg-[#22c55e]/20 text-[#22c55e]",
    cancelled: "bg-[#ef4444]/20 text-[#ef4444]",
  };

  const statusLabels: Record<string, string> = {
    new: "Nová",
    confirmed: "Potvrdená",
    cancelled: "Zrušená",
  };

  // Rozdelenie podľa stavu pre header KPIs
  const newCount = reservations.filter((r) => r.status === "new").length;
  const confirmedCount = reservations.filter(
    (r) => r.status === "confirmed"
  ).length;
  const cancelledCount = reservations.filter(
    (r) => r.status === "cancelled"
  ).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Rezervácie</h1>
          <p className="text-[#6b7a94] text-sm mt-1">
            {reservations.length} celkom · {newCount} nových · {confirmedCount}{" "}
            potvrdených · {cancelledCount} zrušených
          </p>
        </div>
      </div>

      {reservations.length === 0 ? (
        <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-12 text-center">
          <p className="text-[#6b7a94]">Žiadne rezervácie zatiaľ.</p>
        </div>
      ) : (
        <div className="bg-[#0c1221] rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-[#6b7a94] font-medium uppercase tracking-wider px-6 py-4">
                  Zákazník
                </th>
                <th className="text-left text-xs text-[#6b7a94] font-medium uppercase tracking-wider px-6 py-4">
                  Kontakt
                </th>
                <th className="text-left text-xs text-[#6b7a94] font-medium uppercase tracking-wider px-6 py-4">
                  Auto
                </th>
                <th className="text-left text-xs text-[#6b7a94] font-medium uppercase tracking-wider px-6 py-4">
                  Termín
                </th>
                <th className="text-left text-xs text-[#6b7a94] font-medium uppercase tracking-wider px-6 py-4">
                  Stav
                </th>
                <th className="text-left text-xs text-[#6b7a94] font-medium uppercase tracking-wider px-6 py-4">
                  Prijatá
                </th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium">{r.name}</p>
                    {r.message && (
                      <p className="text-xs text-[#6b7a94] mt-1 max-w-[200px] truncate">
                        {r.message}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <a
                      href={`mailto:${r.email}`}
                      className="text-[#f87171] hover:underline block"
                    >
                      {r.email}
                    </a>
                    <a
                      href={`tel:${r.phone}`}
                      className="text-[#94a3b8] text-xs hover:underline block mt-0.5"
                    >
                      {r.phone}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {r.car ? (
                      <>
                        <p className="text-[#f0f2f5]">
                          {r.car.brand} {r.car.model}
                        </p>
                        <p className="text-xs text-[#6b7a94]">{r.car.year}</p>
                      </>
                    ) : (
                      <span className="text-[#6b7a94] italic text-xs">
                        auto odstránené
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#94a3b8]">
                    {r.preferred_date
                      ? new Date(r.preferred_date).toLocaleDateString("sk")
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                        statusColors[r.status]
                      }`}
                    >
                      {statusLabels[r.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#94a3b8]">
                    {new Date(r.created_at).toLocaleDateString("sk", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 text-xs text-[#6b7a94]">
        <p>
          <strong>Tip:</strong> E-maily zákazníkov sú klikateľné. Po odpovedi
          zmeň stav na <em>Potvrdená</em> v edit view (TODO — zatiaľ len
          read-only).
        </p>
      </div>
    </div>
  );
}
