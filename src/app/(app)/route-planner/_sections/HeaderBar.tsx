"use client";

export default function HeaderBar({
  onCopy,
  onClear,
}: {
  onCopy: () => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">Route Planner (AI)</h1>
        <p className="text-textmuted text-sm">
          Type your route, get smart checkpoint suggestions with highlights & distances.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onCopy} className="rounded-xl px-3 py-2 bg-white/5 border border-border">
          Copy JSON
        </button>
        <button onClick={onClear} className="rounded-xl px-3 py-2 bg-white/5 border border-border">
          Clear
        </button>
      </div>
    </div>
  );
}
