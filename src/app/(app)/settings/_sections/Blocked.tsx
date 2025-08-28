// src/app/(app)/setting/_sections/Blocked.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { SettingsState } from "../SettingsClient";
import { CardRow, TextInput } from "../_components/Field";

// Proxy to your existing userConnection routes
async function uc(path: string, init?: RequestInit) {
  const res = await fetch(`/api/userConnection?path=${encodeURIComponent(path)}`, {
    ...init,
    headers: { Accept: "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.success === false) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
}

type BlockedUser = { id: string; name: string; username?: string; avatarUrl?: string };

export default function BlockedSection({
  state,        // kept for signature parity; not used for data source now
  setState,     // kept for signature parity
}: {
  state: SettingsState;
  setState: React.Dispatch<React.SetStateAction<SettingsState>>;
}) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState<Record<string, boolean>>({}); // per-row unblock spinner

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      // ⚠️ if your list path differs, adjust here (e.g., "blocks" or "blocks?type=list")
      const out = await uc("blocks/list");
      const arr = (out?.data?.items || out?.data || []).map((u: any) => ({
        id: String(u.id ?? u._id ?? u.userId),
        name: String(u.name ?? u.fullName ?? u.userName ?? "—"),
        username: u.userName ?? u.username,
        avatarUrl: u.avatarUrl ?? u.avatar,
      })) as BlockedUser[];
      setItems(arr);
    } catch (e: any) {
      setErr(e?.message || "Failed to load blocked users");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter(u =>
      (u.name || "").toLowerCase().includes(needle) ||
      (u.username || "").toLowerCase().includes(needle)
    );
  }, [q, items]);

  async function onUnblock(id: string) {
    if (!id || pending[id]) return;
    setPending(p => ({ ...p, [id]: true }));
    try {
      await uc(`blocks/${id}`, { method: "DELETE" });
      setItems(prev => prev.filter(x => x.id !== id));
    } catch (e) {
      console.error("unblock failed", e);
    } finally {
      setPending(p => {
        const { [id]: _, ...rest } = p;
        return rest;
      });
    }
  }

  return (
    <CardRow>
      {/* Search (no Add button) */}
      <div className="mb-3 grid sm:grid-cols-[1fr_auto] gap-2">
        <TextInput
          placeholder="Search blocked users…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          type="button"
          onClick={load}
          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm"
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {/* Error */}
      {err && (
        <div className="mb-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
          {err}
        </div>
      )}

      {/* Loading skeleton */}
      {loading ? (
        <ul className="divide-y divide-border">
          {[...Array(3)].map((_, i) => (
            <li key={i} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse" />
                <div className="space-y-1">
                  <div className="h-3 w-40 bg-white/10 rounded animate-pulse" />
                  <div className="h-2.5 w-28 bg-white/10 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-8 w-20 rounded-lg bg-white/10 animate-pulse" />
            </li>
          ))}
        </ul>
      ) : filtered.length === 0 ? (
        <div className="py-6 text-center text-sm text-textmuted">
          No blocked users
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {filtered.map((u) => (
            <li key={u.id} className="flex items-center justify-between py-3">
              <div className="min-w-0 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={u.avatarUrl || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"}
                  className="h-8 w-8 rounded-full"
                  alt=""
                />
                <div className="min-w-0">
                  <div className="truncate font-medium">{u.name}</div>
                  {u.username && (
                    <div className="truncate text-xs text-textmuted">@{u.username}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] rounded-full border border-border bg-white/10 px-2 py-[2px]">
                  Blocked
                </span>
                <button
                  onClick={() => onUnblock(u.id)}
                  disabled={!!pending[u.id]}
                  className={[
                    "px-3 py-1.5 rounded-lg text-sm",
                    pending[u.id] ? "opacity-60 cursor-not-allowed bg-white/10" : "bg-white/10 hover:bg-white/15",
                  ].join(" ")}
                >
                  {pending[u.id] ? "Unblocking…" : "Unblock"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </CardRow>
  );
}
