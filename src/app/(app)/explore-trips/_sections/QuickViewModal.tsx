"use client";

import type { Trip } from "../types";

export default function QuickViewModal({
  trip,
  imageUrl,
  onClose,
  onOpenChat,
  onJoin,
}: {
  trip: Trip | null;
  imageUrl: string;
  onClose: () => void;
  onOpenChat: () => void;
  onJoin: () => void;
}) {
  if (!trip) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-50" onClick={(e) => e.currentTarget === e.target && onClose()}>
      <div className="mx-auto mt-16 max-w-2xl bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="font-semibold">Trip Details</div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10">✕</button>
        </div>

        <div className="p-4 space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <img src={imageUrl} className="h-20 w-28 rounded-lg object-cover" alt="" />
            <div className="min-w-0">
              <div className="font-semibold">{trip.title}</div>
              <div className="text-sm text-textmuted">
                {trip.city}, {trip.state} • {fmtDate(trip.start)} — {fmtDate(trip.end)} ({trip.days}d)
              </div>
              <div className="mt-1 flex flex-wrap gap-2 text-xs">
                <Chip>{trip.type}</Chip>
                <Chip>{trip.diff}</Chip>
                <Chip>{trip.km} km</Chip>
                <Chip>₹{trip.budget}/head</Chip>
                <Chip>{trip.members}/{trip.max} members</Chip>
              </div>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-white/90">
            Plan includes scenic halts, safe fuel stops, and a breakfast point. Pace set for {trip.diff.toLowerCase()} riders.
          </p>
          <div className="text-xs text-textmuted">
            Host: <span className="text-white">{trip.host}</span>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-border flex items-center justify-end gap-2">
          <button onClick={onOpenChat} className="rounded-xl px-3 py-2 bg-white/5 border border-border">Open Chat</button>
          <button onClick={onJoin} className="rounded-xl px-3 py-2 bg-accent text-white">Request to Join</button>
        </div>
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 bg-white/10 border border-border rounded-full px-2 py-1">
      {children}
    </span>
  );
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: "2-digit", month: "short" });
}
