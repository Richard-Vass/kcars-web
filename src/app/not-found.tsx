import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="sk">
      <body className="min-h-screen bg-[#060a12] text-[#f0f2f5] flex items-center justify-center font-sans">
        <div className="text-center px-4">
          <p className="text-8xl font-black bg-gradient-to-r from-[#ef4444] to-[#f97316] bg-clip-text text-transparent">
            404
          </p>
          <h1 className="text-2xl font-bold mt-4">Stránka nenájdená</h1>
          <p className="text-[#6b7a94] mt-2 max-w-md mx-auto">
            Táto stránka neexistuje alebo bola presunutá.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link
              href="/sk"
              className="bg-gradient-to-r from-[#ef4444] to-[#f97316] text-white font-semibold px-6 py-3 rounded-xl hover:-translate-y-0.5 transition-all"
            >
              Domov
            </Link>
            <Link
              href="/sk/ponuka"
              className="bg-white/5 border border-white/10 text-[#f0f2f5] font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-all"
            >
              Ponuka áut
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
