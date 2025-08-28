// src/app/(app)/dashboard/profile/_sections/FollowActions.client.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type Counts = { followers: number; following: number };
type Status = {
  following: boolean;
  followedBy: boolean;
  requested: boolean;
  iBlocked: boolean;
  blockedMe: boolean;
};

// Single proxy helper → hits ONE Next API route: /api/userConnection?path=...
async function uc(path: string, init?: RequestInit) {
  const res = await fetch(`/api/userConnection?path=${encodeURIComponent(path)}`, {
    ...init,
    headers: { Accept: "application/json", ...(init?.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.success === false) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
}

export default function FollowActions({
  profileUserId,
  initialCounts,
  initialStatus,
}: {
  profileUserId: string;
  initialCounts?: Counts;
  initialStatus?: Status;
}) {
  const [counts, setCounts] = useState<Counts>(initialCounts ?? { followers: 0, following: 0 });
  const [status, setStatus] = useState<Status | null>(initialStatus ?? null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const disabled = useMemo(() => loading || status?.blockedMe, [loading, status]);

  // Load status + counts (unless provided via SSR)
  useEffect(() => {
    if (initialCounts && initialStatus) return;
    let live = true;
    (async () => {
      try {
        const [st, ct] = await Promise.all([
          uc(`follows/status/${profileUserId}`),
          uc(`follows/${profileUserId}/counts`),
        ]);
        if (!live) return;
        setStatus(st.data as Status);
        setCounts({
          followers: ct.data.followersCount ?? 0,
          following: ct.data.followingCount ?? 0,
        });
      } catch (e: any) {
        if (!live) return;
        setErr(e?.message || "Failed to load relation");
      }
    })();
    return () => { live = false; };
  }, [profileUserId, initialCounts, initialStatus]);

  async function doFollow() {
    if (!status || disabled) return;
    setErr(null); setLoading(true);
    try {
      if (!status.following) {
        // optimistic
        setStatus({ ...status, following: true, requested: false });
        setCounts((c) => ({ ...c, followers: c.followers + 1 }));
        await uc(`follows/${profileUserId}`, { method: "POST" });
      } else {
        setStatus({ ...status, following: false });
        setCounts((c) => ({ ...c, followers: Math.max(0, c.followers - 1) }));
        await uc(`follows/${profileUserId}`, { method: "DELETE" });
      }
    } catch (e: any) {
      setErr(e?.message || "Action failed");
      // refresh from server
      try {
        const st = await uc(`follows/status/${profileUserId}`);
        setStatus(st.data as Status);
        const ct = await uc(`follows/${profileUserId}/counts`);
        setCounts({ followers: ct.data.followersCount ?? 0, following: ct.data.followingCount ?? 0 });
      } catch {}
    } finally {
      setLoading(false);
    }
  }

  async function doBlockToggle() {
    if (!status) return;
    setErr(null); setLoading(true);
    try {
      if (!status.iBlocked) {
        await uc(`blocks/${profileUserId}`, { method: "POST" });
        setStatus({ ...status, iBlocked: true, following: false, followedBy: false, requested: false });
      } else {
        await uc(`blocks/${profileUserId}`, { method: "DELETE" });
        setStatus({ ...status, iBlocked: false });
      }
      const ct = await uc(`follows/${profileUserId}/counts`);
      setCounts({ followers: ct.data.followersCount ?? 0, following: ct.data.followingCount ?? 0 });
    } catch (e: any) {
      setErr(e?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  }

  if (!status) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-9 w-28 animate-pulse rounded-full bg-white/10" />
        <div className="h-9 w-28 animate-pulse rounded-full bg-white/10" />
      </div>
    );
  }

  const followLabel = status.blockedMe
    ? "Blocked by user"
    : status.iBlocked
    ? "Blocked"
    : status.following
    ? "Unfollow"
    : status.requested
    ? "Requested"
    : "Follow";

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={doFollow}
        disabled={disabled || status.iBlocked}
        className={[
          "h-9 rounded-full px-4 text-sm font-semibold transition",
          status.following ? "bg-white/10 hover:bg-white/15" : "bg-[#F15A2B] hover:bg-[#e35224]",
          (disabled || status.iBlocked) ? "opacity-60 cursor-not-allowed" : "",
        ].join(" ")}
        aria-disabled={disabled || status.iBlocked}
      >
        {loading ? "Please wait…" : followLabel}
      </button>

      <button
        onClick={doBlockToggle}
        disabled={loading}
        className={[
          "h-9 rounded-full px-4 text-sm font-medium border border-white/20 hover:bg-white/5 transition",
          loading ? "opacity-60 cursor-not-allowed" : "",
        ].join(" ")}
      >
        {status.iBlocked ? "Unblock" : "Block"}
      </button>


      {err && <span className="ml-2 text-xs text-rose-300">{err}</span>}
    </div>
  );
}
