export default function CarCardSkeleton() {
  return (
    <div className="bg-[#111a2e] rounded-[20px] overflow-hidden border border-white/5 animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-[16/10] bg-[#0c1221]" />

      <div className="p-6 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-3 w-16 bg-[#1e293b] rounded" />
            <div className="h-5 w-40 bg-[#1e293b] rounded" />
          </div>
          <div className="h-6 w-24 bg-[#1e293b] rounded" />
        </div>
        <div className="flex gap-3 mt-4">
          <div className="h-3 w-12 bg-[#1e293b] rounded" />
          <div className="h-3 w-20 bg-[#1e293b] rounded" />
          <div className="h-3 w-14 bg-[#1e293b] rounded" />
          <div className="h-3 w-16 bg-[#1e293b] rounded" />
        </div>
      </div>
    </div>
  );
}
