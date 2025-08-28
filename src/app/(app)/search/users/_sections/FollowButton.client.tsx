"use client";

import { useMemo, useState } from "react";

// same proxy helper
async function uc(path: string, init?: RequestInit) {
  const res = await fetch(`/api/userConnection?path=${encodeURIComponent(path)}`, {
    ...init,
    headers: { Accept: "application/json", ...(init?.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.success === false) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
}

type Props = {
  userId: string;                 // profile/user card owner
  viewerId?: string;              // current logged-in user id (optional)
  isSelf?: boolean;               // if you already know it's self
  initialFollowing?: boolean;
};

export default function FollowButton({
  userId,
  viewerId,
  isSelf,
  initialFollowing = false,
}: Props) {
  const [following, setFollowing] = useState<boolean>(initialFollowing);
  const [loading, setLoading] = useState(false);

  const self = useMemo(
    () => (typeof isSelf === "boolean" ? isSelf : viewerId ? viewerId === userId : false),
    [isSelf, viewerId, userId]
  );

  // Do not render on own card
  if (self) return null;

  async function toggle() {
    if (loading) return;
    setLoading(true);
    try {
      const method = following ? "DELETE" : "POST";
      const data: any = await uc(`follows/${encodeURIComponent(userId)}`, { method });
      if (typeof data?.following === "boolean") setFollowing(data.following);
      else setFollowing((prev) => !prev);
    } catch (e) {
      console.error("Follow toggle failed:", e);
    } finally {
      setLoading(false);
    }
  }

  const base =
    "ml-auto inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold shadow-sm transition";
  const followCls = "bg-[#ED562C] hover:bg-[#e35224] text-white";
  // Different styling for Unfollow
  const unfollowCls =
    "bg-white/10 hover:bg-white/15 text-white border border-white/20"; // tweak per theme if needed

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-disabled={loading}
      aria-pressed={following}
      aria-busy={loading}
      className={[
        base,
        following ? unfollowCls : followCls,
        loading ? "opacity-60 cursor-not-allowed" : "",
      ].join(" ")}
    >
      {following ? "Unfollow" : "Follow"}
    </button>
  );
}
