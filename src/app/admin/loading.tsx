export default function LoadingAdmin() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-36 bg-white/5 rounded-xl animate-pulse mb-2" />
          <div className="h-4 w-48 bg-white/5 rounded-xl animate-pulse" />
        </div>
        <div className="h-10 w-44 bg-white/5 rounded-xl animate-pulse" />
      </div>

      <div className="bg-[#0c1221] rounded-2xl border border-white/5 overflow-hidden">
        <div className="border-b border-white/5 h-14 bg-white/[0.02]" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="border-b border-white/5 h-20 flex items-center px-6 gap-6"
            aria-hidden="true"
          >
            <div className="h-5 w-40 bg-white/5 rounded animate-pulse" />
            <div className="h-5 w-16 bg-white/5 rounded animate-pulse" />
            <div className="h-5 w-24 bg-white/5 rounded animate-pulse" />
            <div className="h-5 w-20 bg-white/5 rounded animate-pulse" />
            <div className="h-6 w-24 bg-white/5 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
