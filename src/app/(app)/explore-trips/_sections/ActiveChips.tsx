"use client";

import type { Filters } from "../types";

export default function ActiveChips({ filters }: { filters: Filters }) {
  const chips: { k: string; v: string }[] = [];
  if (filters.loc) chips.push({ k: "Location", v: filters.loc });
  if (filters.from) chips.push({ k: "From", v: filters.from });
  if (filters.to) chips.push({ k: "To", v: filters.to });
  if (filters.budget != null) chips.push({ k: "Budget ≤", v: "₹" + filters.budget });
  if (filters.maxKm != null) chips.push({ k: "Max km", v: String(filters.maxKm) });
  filters.diffs.forEach((v) => chips.push({ k: "Difficulty", v }));
  filters.types.forEach((v) => chips.push({ k: "Type", v }));

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map(({ k, v }, i) => (
        <span key={`${k}-${v}-${i}`} className="inline-flex items-center gap-1 bg-white/10 border border-border rounded-full px-2 py-1 text-sm">
          {k}: {v}
        </span>
      ))}
    </div>
  );
}
