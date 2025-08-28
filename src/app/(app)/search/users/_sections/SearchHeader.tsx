"use client";

export default function SearchHeader({
  q,
  onChange,
  view,
  onToggleView,
  count,
  loading,
}: {
  q: string;
  onChange: (v: string) => void;
  view: "grid" | "list";
  onToggleView: (v: "grid" | "list") => void;
  count: number;
  loading: boolean;
}) {
  return (
    <>
      {/* Sticky header with search + view toggle only */}
      <div className="sticky top-0 z-30 -mx-4 mb-4 border-b border-[var(--gr-border,#233042)] sm:-mx-6">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-2 px-4 py-3 sm:px-6">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              value={q}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Search users, locations…"
              className="w-full rounded-xl border border-[var(--gr-border,#233042)] bg-[#253341] px-9 pr-3 py-2.5 text-sm shadow-sm outline-none ring-0 placeholder:text-white/40 focus:border-[var(--gr-primary,#30455F)]"
            />
          </div>

          {/* View toggle */}
          <div className="hidden sm:flex rounded-xl border border-[var(--gr-border,#233042)] p-1">
            <button
              onClick={() => onToggleView("grid")}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm ${view === "grid" ? "bg-white/10" : "opacity-70 hover:opacity-100"}`}
              aria-pressed={view === "grid"}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Grid
            </button>
            <button
              onClick={() => onToggleView("list")}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm ${view === "list" ? "bg-white/10" : "opacity-70 hover:opacity-100"}`}
              aria-pressed={view === "list"}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              List
            </button>
          </div>
        </div>
      </div>

      {/* Meta row */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-white/60">
          Showing <span className="font-medium text-white">{count}</span> users
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-sm text-white/60">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            Searching…
          </div>
        )}
      </div>
    </>
  );
}
