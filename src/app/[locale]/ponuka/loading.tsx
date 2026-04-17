export default function LoadingPonuka() {
  return (
    <div className="min-h-screen bg-[#060a12] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header skeleton */}
        <div className="mb-12">
          <div className="h-10 w-72 bg-white/5 rounded-xl animate-pulse mb-3" />
          <div className="h-5 w-48 bg-white/5 rounded-xl animate-pulse" />
        </div>

        {/* Filters skeleton */}
        <div className="mb-8 bg-[#0c1221] border border-white/5 rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>

        {/* Cars grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#0c1221] border border-white/5 rounded-2xl overflow-hidden"
              aria-hidden="true"
            >
              <div className="aspect-[16/10] bg-white/5 animate-pulse" />
              <div className="p-5">
                <div className="h-6 w-3/4 bg-white/5 rounded animate-pulse mb-3" />
                <div className="h-4 w-1/2 bg-white/5 rounded animate-pulse mb-4" />
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="h-4 bg-white/5 rounded animate-pulse" />
                  <div className="h-4 bg-white/5 rounded animate-pulse" />
                  <div className="h-4 bg-white/5 rounded animate-pulse" />
                </div>
                <div className="h-8 w-24 bg-white/5 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
