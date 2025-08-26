"use client";

import type { SortKey } from "../types";

export default function HeaderActions({
  q,
  onQuery,
  sort,
  onSort,
  onOpenFilters,
}: {
  q: string;
  onQuery: (q: string) => void;
  sort: SortKey;
  onSort: (s: SortKey) => void;
  onOpenFilters: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">Explore Trips</h1>
        <p className="text-textmuted text-sm">Find public rides and join fellow riders.</p>
      </div>

      <div className="flex items-center gap-2">
        {/* Desktop search */}
        <div className="hidden sm:flex items-center bg-card border border-border rounded-2xl px-3 py-2 min-w-[280px]">
          <svg className="h-5 w-5 mr-2 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input
            value={q}
            onChange={(e) => onQuery(e.target.value)}
            className="bg-transparent outline-none w-full placeholder:text-textmuted"
            placeholder="Search destination, city, host…"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => onSort(e.target.value as SortKey)}
          className="bg-transparent border border-border rounded-xl px-3 py-2 outline-none focus:border-accent focus:ring-4 focus:ring-accent/35"
        >
          <option className="bg-slatebg" value="soon">Starting soon</option>
          <option className="bg-slatebg" value="popular">Most popular</option>
          <option className="bg-slatebg" value="distance">Distance (low→high)</option>
          <option className="bg-slatebg" value="budget">Budget (low→high)</option>
        </select>

        <button onClick={onOpenFilters} className="btn btn-ghost sm:hidden rounded-xl px-3 py-2 border border-border bg-white/5">
          Filters
        </button>
      </div>
    </div>
  );
}
