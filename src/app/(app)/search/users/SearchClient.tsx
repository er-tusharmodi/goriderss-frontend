// app/(app)/search/SearchClient.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { UserSearchItem } from "./types";
import SearchHeader from "./_sections/SearchHeader";
import ResultsGrid from "./_sections/ResultsGrid";
import EmptyState from "./_sections/EmptyState";
import SkeletonCard from "./_sections/SkeletonCard";

type ApiResp = {
  success?: boolean;
  data?: {
    items: UserSearchItem[];
    pagination: { page: number; limit: number; total: number; hasNext: boolean };
  };
  message?: string;
};

export default function SearchClient({
  initialQ = "",
  initialView = "grid",
}: {
  initialQ?: string;
  initialView?: "grid" | "list";
}) {
  const [q, setQ] = useState(initialQ);
  const [view, setView] = useState<"grid" | "list">(initialView);
  const [items, setItems] = useState<UserSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<number | null>(null);

  // 👇 keep local state in sync with server-provided initialQ (on navigation)
  useEffect(() => {
    setQ(initialQ);
  }, [initialQ]);

  // optional: sync view too
  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  const search = useCallback(async (query: string) => {
    setLoading(true);
    setErr(null);
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch(
        `/api/search/users?q=${encodeURIComponent(query)}&page=1&limit=24`,
        { signal: ac.signal, cache: "no-store" }
      );
      const data = (await res.json()) as ApiResp;
      if (!res.ok || data?.success === false)
        throw new Error(data?.message || `HTTP ${res.status}`);
      const arr = data?.data?.items ?? [];
      setItems(arr);
      setCount(data?.data?.pagination?.total ?? arr.length);
    } catch (e: any) {
      if (e?.name !== "AbortError") setErr(e?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }, []);

  // debounce searches triggered from SearchHeader on this page
  const debouncedSearch = useMemo(() => {
    return (query: string) => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => search(query), 300);
    };
  }, [search]);

  // 🔑 trigger search when q changes (including when initialQ changes after navigation)
  useEffect(() => {
    debouncedSearch(q.trim());
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [q, debouncedSearch]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const gridCls =
    view === "grid"
      ? "grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5"
      : "grid grid-cols-1 gap-4";

  return (
    <div className="mx-auto w-full max-w-7xl p-4 sm:p-6">
      {/* <SearchHeader
        q={q}
        onChange={setQ}
        view={view}
        onToggleView={setView}
        count={count}
        loading={loading}
      /> */}

      <div className="mb-4" />

      {loading ? (
        <div className={gridCls}>
          {Array.from({ length: view === "grid" ? 8 : 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState onClear={() => setQ("")} />
      ) : (
        <div className={gridCls}>
          <ResultsGrid items={items} />
        </div>
      )}

      {err && (
        <p className="mt-4 text-sm text-rose-300">
          {err} — please try again.
        </p>
      )}
    </div>
  );
}
