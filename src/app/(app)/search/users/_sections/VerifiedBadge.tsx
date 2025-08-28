export default function VerifiedBadge({ show }: { show?: boolean }) {
  if (!show) return null;
  return (
    <span className="inline-flex whitespace-nowrap items-center gap-1 rounded-full border border-[#ED562C]/30 bg-[#ED562C]/15 px-2 py-0.5 text-[11px] font-medium text-[#ED562C]">
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
      Verified
    </span>
  );
}
