import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Financovanie a leasing — Kalkulačka splátok",
  description: "Splátkový predaj, leasing a prefinancovanie áut. Akontácia od 0%, doba splácania až 84 mesiacov, schválenie do 30 minút. K cars autobazár.",
};

export default function LeasingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
