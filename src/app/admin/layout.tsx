import "../globals.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk" className="h-full antialiased">
      <body className="min-h-full bg-[#060a12] text-[#f0f2f5] font-sans">
        <nav className="bg-[#0c1221] border-b border-white/5 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <a href="/admin" className="text-xl font-bold">
                K<span className="text-[#ef4444]">Cars</span> <span className="text-[#6b7a94] text-sm font-normal">Admin</span>
              </a>
              <a href="/admin" className="text-sm text-[#6b7a94] hover:text-white transition-colors">Vozidlá</a>
              <a href="/admin/pridat" className="text-sm text-[#6b7a94] hover:text-white transition-colors">+ Pridať</a>
            </div>
            <a href="/sk" className="text-sm text-[#6b7a94] hover:text-white transition-colors">← Web</a>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
