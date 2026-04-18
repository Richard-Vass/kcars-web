import { Inter } from "next/font/google";
import Link from "next/link";
import "../globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#060a12] text-[#f0f2f5] font-sans">
        <nav className="bg-[#0c1221] border-b border-white/5 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="text-xl font-bold">
                K<span className="text-[#ef4444]">Cars</span> <span className="text-[#6b7a94] text-sm font-normal">Admin</span>
              </Link>
              <Link href="/admin" className="text-sm text-[#6b7a94] hover:text-white transition-colors">Vozidlá</Link>
              <Link href="/admin/pridat" className="text-sm text-[#6b7a94] hover:text-white transition-colors">+ Pridať</Link>
              <Link href="/admin/rezervacie" className="text-sm text-[#6b7a94] hover:text-white transition-colors">Rezervácie</Link>
              <Link href="/admin/dashboard" className="text-sm text-[#6b7a94] hover:text-white transition-colors">Dashboard</Link>
            </div>
            <Link href="/sk" className="text-sm text-[#6b7a94] hover:text-white transition-colors">← Web</Link>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
