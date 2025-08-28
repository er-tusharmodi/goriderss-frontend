export default function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--gr-border,#233042)] bg-[var(--gr-bg-elev,#111A27)]">
      <div className="h-0.5 bg-gradient-to-r from-[#ED562C] via-[#30455F] to-[#FD9124] opacity-30" />
      <div className="p-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 animate-pulse rounded-full bg-white/10" />
          <div className="flex-1">
            <div className="mb-2 h-4 w-40 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-64 animate-pulse rounded bg-white/10" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="h-6 w-20 animate-pulse rounded-full bg-white/10" />
          <div className="h-6 w-24 animate-pulse rounded-full bg-white/10" />
        </div>
        <div className="mt-3 h-4 w-full animate-pulse rounded bg-white/10" />
      </div>
      <div className="flex items-center gap-2 p-5 pt-0">
        <div className="h-8 w-28 animate-pulse rounded bg-white/10" />
        <div className="ml-auto h-8 w-24 animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}
