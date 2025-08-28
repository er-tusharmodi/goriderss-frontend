export default function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="mx-auto max-w-md text-center">
      <svg viewBox="0 0 120 120" className="mx-auto mb-4 h-24 w-24 text-white/80">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ED562C" />
            <stop offset="100%" stopColor="#30455F" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="54" fill="url(#g)" opacity="0.12" />
        <path d="M34 74h52M34 60h52M34 46h28" stroke="currentColor" strokeOpacity=".25" strokeWidth="4" strokeLinecap="round" />
        <circle cx="86" cy="46" r="6" fill="currentColor" opacity=".2" />
      </svg>
      <h3 className="text-lg font-semibold">No users found</h3>
      <p className="mt-1 text-sm text-white/60">Try different keywords.</p>
      <button
        onClick={onClear}
        className="mt-4 inline-flex items-center rounded-xl border border-[var(--gr-border,#233042)] bg-[var(--gr-bg-elev,#111A27)] px-4 py-2 text-sm shadow-sm hover:bg-white/5"
      >
        Clear
      </button>
    </div>
  );
}
