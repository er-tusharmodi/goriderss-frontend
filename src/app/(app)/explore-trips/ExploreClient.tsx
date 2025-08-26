"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Filters, SortKey, Trip } from "./types";
import { allTrips } from "./_data/trips";
import HeaderActions from "./_sections/HeaderActions";
import FiltersDesktop from "./_sections/FiltersDesktop";
import FiltersSheet from "./_sections/FiltersSheet";
import ActiveChips from "./_sections/ActiveChips";
import TripsGrid from "./_sections/TripsGrid";
import QuickViewModal from "./_sections/QuickViewModal";

const IMG = "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";

export default function ExploreClient() {
  // ----- filters/state -----
  const [filters, setFilters] = useState<Filters>({
    q: "",
    sort: "soon",
    loc: "",
    from: "",
    to: "",
    budget: null,
    maxKm: null,
    diffs: [],
    types: [],
  });

  const [sheetOpen, setSheetOpen] = useState(false);

  // Infinite scroll state
  const [cursor, setCursor] = useState(0);
  const batchSize = 9;
  const [visible, setVisible] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Modal
  const [selected, setSelected] = useState<Trip | null>(null);

  // ----- derived: filtered list -----
  const filtered = useMemo(() => {
    const out = applyFilters(allTrips, filters);
    return out;
  }, [filters]);

  // Reset grid when filters change
  useEffect(() => {
    setVisible([]);
    setCursor(0);
    setDone(false);
  }, [filtered]);

  // Load next batch
  const loadMore = useCallback(async () => {
    if (loading || done) return;
    setLoading(true);
    // simulate latency; replace with API call later
    await new Promise((r) => setTimeout(r, 250));
    const next = filtered.slice(cursor, cursor + batchSize);
    setVisible((v) => [...v, ...next]);
    setCursor(cursor + next.length);
    if (next.length === 0) setDone(true);
    setLoading(false);
  }, [filtered, cursor, loading, done]);

  // Observer
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && loadMore()),
      { rootMargin: "600px 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [loadMore]);

  // ----- actions -----
  function updateFilters(patch: Partial<Filters>) {
    setFilters((f) => ({ ...f, ...patch }));
  }

  function toggleSaved(id: string) {
    setVisible((v) =>
      v.map((t) => (t.id === id ? { ...t, saved: !t.saved } : t))
    );
    // NOTE: we are not mutating the global `allTrips` here; wire to backend
  }

  function openModal(id: string) {
    const t = [...visible, ...filtered].find((x) => x.id === id);
    if (t) setSelected(t);
  }

  return (
    <div className="space-y-6">
      {/* Header / Actions */}
      <HeaderActions
        q={filters.q}
        onQuery={(q) => updateFilters({ q })}
        sort={filters.sort}
        onSort={(s) => updateFilters({ sort: s })}
        onOpenFilters={() => setSheetOpen(true)}
      />

      <div className="grid lg:grid-cols-[300px_minmax(0,1fr)] gap-4">
        {/* Filters desktop */}
        <FiltersDesktop
          value={filters}
          onChange={updateFilters}
          onApply={() => {/* no-op, live update */}}
          onClear={() =>
            setFilters((f) => ({
              ...f,
              loc: "",
              from: "",
              to: "",
              budget: null,
              maxKm: null,
              diffs: [],
              types: [],
            }))
          }
        />

        {/* Results + mobile search etc. */}
        <section className="space-y-3">
          {/* Mobile search box */}
          <div className="sm:hidden">
            <div className="flex items-center bg-card border border-border rounded-2xl px-3 py-2">
              <SearchIcon />
              <input
                value={filters.q}
                onChange={(e) => updateFilters({ q: e.target.value })}
                className="bg-transparent outline-none w-full placeholder:text-textmuted"
                placeholder="Search destination, city, host…"
              />
            </div>
          </div>

          {/* Active chips */}
          <ActiveChips filters={filters} />

          {/* Grid */}
          <TripsGrid
            items={visible}
            imageUrl={IMG}
            onView={(id) => openModal(id)}
            onJoin={(id) => openModal(id)}
            onToggleSave={(id) => toggleSaved(id)}
          />

          {/* Loader + sentinel */}
          <div
            className={`flex items-center justify-center py-6 text-textmuted ${loading ? "" : "hidden"}`}
          >
            <Spinner />
            Loading more trips…
          </div>
          <div ref={sentinelRef} className="h-2" />
        </section>
      </div>

      {/* Mobile filters sheet */}
      <FiltersSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        value={filters}
        onChange={updateFilters}
        onApply={() => setSheetOpen(false)}
        onClear={() =>
          setFilters((f) => ({
            ...f,
            loc: "",
            from: "",
            to: "",
            budget: null,
            maxKm: null,
            diffs: [],
            types: [],
          }))
        }
      />

      {/* Quick view modal */}
      <QuickViewModal
        trip={selected}
        imageUrl={IMG}
        onClose={() => setSelected(null)}
        onOpenChat={() => alert("Open chat (wire to router)")}
        onJoin={() => {
          alert("Join request sent (mock)");
          setSelected(null);
        }}
      />
    </div>
  );
}

/* ---------- helpers (local) ---------- */
function applyFilters(src: Trip[], f: Filters) {
  let out = src.filter((t) => {
    if (f.q) {
      const qq = f.q.toLowerCase();
      if (
        !(
          t.title.toLowerCase().includes(qq) ||
          t.city.toLowerCase().includes(qq) ||
          t.state.toLowerCase().includes(qq) ||
          t.host.toLowerCase().includes(qq)
        )
      )
        return false;
    }
    if (f.loc) {
      const ll = f.loc.toLowerCase();
      if (!(t.city.toLowerCase().includes(ll) || t.state.toLowerCase().includes(ll))) return false;
    }
    if (f.from && new Date(t.start) < new Date(f.from)) return false;
    if (f.to && new Date(t.start) > new Date(f.to)) return false;
    if (f.budget != null && t.budget > f.budget) return false;
    if (f.maxKm != null && t.km > f.maxKm) return false;
    if (f.diffs?.length && !f.diffs.includes(t.diff)) return false;
    if (f.types?.length && !f.types.includes(t.type)) return false;
    return true;
  });

  switch (f.sort) {
    case "popular": out.sort((a, b) => b.members - a.members); break;
    case "distance": out.sort((a, b) => a.km - b.km); break;
    case "budget": out.sort((a, b) => a.budget - b.budget); break;
    case "soon": default: out.sort((a, b) => +new Date(a.start) - +new Date(b.start));
  }
  return out;
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity=".25" strokeWidth="4"></circle>
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4"></path>
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg className="h-5 w-5 mr-2 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
  );
}
