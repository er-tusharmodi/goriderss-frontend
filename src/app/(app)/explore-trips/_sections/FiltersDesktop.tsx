"use client";

import type { Filters, Trip } from "../types";

export default function FiltersDesktop({
  value,
  onChange,
  onApply,
  onClear,
}: {
  value: Filters;
  onChange: (patch: Partial<Filters>) => void;
  onApply: () => void;
  onClear: () => void;
}) {
  return (
  <aside
    className="
      hidden lg:block
      lg:sticky lg:top-24 self-start     
      bg-card border border-border rounded-2xl p-4
      max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar 
    ">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filters</h2>
        <button onClick={onClear} className="text-xs text-textmuted hover:text-white">Clear</button>
      </div>

      <div className="mt-3 space-y-4 text-sm">
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
        <CheckboxGroup
          label="Difficulty"
          options={["Easy", "Moderate", "Hard"]}
          values={value.diffs}
          onToggle={(v) =>
            onChange({
              diffs: toggleValue(value.diffs, v as any),
            })
          }
        />

        {/* Ride Type */}
        <CheckboxGroup
          label="Ride Type"
          options={["ADV", "Roadster", "Cruiser"]}
          values={value.types}
          onToggle={(v) =>
            onChange({
              types: toggleValue(value.types, v as any),
            })
          }
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

        <button onClick={onApply} className="w-full mt-1 rounded-xl px-3 py-2 bg-accent text-white">Apply Filters</button>
      </div>
    </aside>
  );
}

function CheckboxGroup({
  label,
  options,
  values,
  onToggle,
}: {
  label: string;
  options: string[];
  values: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-textmuted mb-1">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const checked = values.includes(opt);
          return (
            <label key={opt} className="inline-flex items-center gap-1 bg-white/10 border border-border rounded-full px-2 py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(opt)}
                className="accent-accent"
              />
              <span>{opt}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function toggleValue<T>(arr: T[], v: T) {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}
