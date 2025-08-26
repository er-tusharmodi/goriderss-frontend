"use client";

import type { Filters } from "../types";

// --- Literal options + derived unions
const DIFFICULTY_OPTIONS = ["Easy", "Moderate", "Hard"] as const;
type Difficulty = (typeof DIFFICULTY_OPTIONS)[number];

const RIDE_TYPE_OPTIONS = ["ADV", "Roadster", "Cruiser"] as const;
type RideType = (typeof RIDE_TYPE_OPTIONS)[number];

export default function FiltersSheet({
  open,
  onClose,
  value,
  onChange,
  onApply,
  onClear,
}: {
  open: boolean;
  onClose: () => void;
  value: Filters; // expect: { diffs: Difficulty[]; types: RideType[]; ... }
  onChange: (patch: Partial<Filters>) => void;
  onApply: () => void;
  onClear: () => void;
}) {
  return (
    <aside
      className={[
        "lg:hidden fixed top-0 right-0 w-[86vw] max-w-sm h-full bg-card border-l border-border p-4 z-50 transition-transform",
        open ? "translate-x-0" : "translate-x-full",
      ].join(" ")}
      aria-hidden={!open}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10" aria-label="Close">
          ✕
        </button>
      </div>

      <div className="mt-3 space-y-4 text-sm overflow-y-auto h-[calc(100vh-100px)] no-scrollbar">
        {/* Location */}
        <div>
          <div className="text-textmuted mb-1">Location</div>
          <input
            value={value.loc}
            onChange={(e) => onChange({ loc: e.target.value })}
            className="w-full bg-transparent border border-border rounded-xl px-3 py-2 outline-none focus:border-accent focus:ring-4 focus:ring-accent/35 placeholder:text-textmuted"
            placeholder="City / State"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-textmuted mb-1">From</div>
            <input
              type="date"
              value={value.from}
              onChange={(e) => onChange({ from: e.target.value })}
              className="w-full bg-transparent border border-border rounded-xl px-3 py-2 outline-none focus:border-accent focus:ring-4 focus:ring-accent/35"
            />
          </div>
          <div>
            <div className="text-textmuted mb-1">To</div>
            <input
              type="date"
              value={value.to}
              onChange={(e) => onChange({ to: e.target.value })}
              className="w-full bg-transparent border border-border rounded-xl px-3 py-2 outline-none focus:border-accent focus:ring-4 focus:ring-accent/35"
            />
          </div>
        </div>

        {/* Budget */}
        <div>
          <div className="text-textmuted mb-1">Max Budget (₹/head)</div>
          <input
            type="number"
            value={value.budget ?? ""}
            onChange={(e) => onChange({ budget: e.target.value ? Number(e.target.value) : null })}
            className="w-full bg-transparent border border-border rounded-xl px-3 py-2 outline-none focus:border-accent focus:ring-4 focus:ring-accent/35 placeholder:text-textmuted"
            placeholder="e.g. 4000"
          />
        </div>

        {/* Difficulty */}
        <CheckGroup<Difficulty>
          label="Difficulty"
          options={DIFFICULTY_OPTIONS}
          values={value.diffs}
          onToggle={(v) => onChange({ diffs: toggle(value.diffs, v) })}
        />

        {/* Ride Type */}
        <CheckGroup<RideType>
          label="Ride Type"
          options={RIDE_TYPE_OPTIONS}
          values={value.types}
          onToggle={(v) => onChange({ types: toggle(value.types, v) })}
        />

        {/* Max Distance */}
        <div>
          <div className="text-textmuted mb-1">Max Distance (km)</div>
          <input
            type="number"
            value={value.maxKm ?? ""}
            onChange={(e) => onChange({ maxKm: e.target.value ? Number(e.target.value) : null })}
            className="w-full bg-transparent border border-border rounded-xl px-3 py-2 outline-none focus:border-accent focus:ring-4 focus:ring-accent/35 placeholder:text-textmuted"
            placeholder="e.g. 600"
          />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button onClick={onClear} className="rounded-xl px-3 py-2 bg-white/5 border border-border">
          Clear
        </button>
        <button onClick={() => { onApply(); onClose(); }} className="rounded-xl px-3 py-2 bg-accent text-white">
          Apply
        </button>
      </div>
    </aside>
  );
}

// ---------- Generic CheckGroup that preserves literal unions ----------
function CheckGroup<T extends string>({
  label,
  options,
  values,
  onToggle,
}: {
  label: string;
  options: readonly T[];
  values: T[];
  onToggle: (v: T) => void;
}) {
  return (
    <div>
      <div className="text-textmuted mb-1">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label
            key={opt}
            className="inline-flex items-center gap-1 bg-white/10 border border-border rounded-full px-2 py-1 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={values.includes(opt)}
              onChange={() => onToggle(opt)}
              className="accent-accent"
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ---------- Union-preserving toggle ----------
function toggle<T extends string>(arr: T[], v: T) {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}
