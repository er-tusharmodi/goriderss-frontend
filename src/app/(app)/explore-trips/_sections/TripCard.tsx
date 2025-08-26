"use client";

import type { Trip } from "../types";

export default function TripCard({
  trip: t,
  imageUrl,
  onView,
  onJoin,
  onToggleSave,
}: {
  trip: Trip;
  imageUrl: string;
  onView: () => void;
  onJoin: () => void;
  onToggleSave: () => void;
}) {
  const left = daysLeft(t.start);
  const fillPct = Math.round((t.members / t.max) * 100);

  return (
    <article className="bg-card border border-border rounded-2xl overflow-hidden hover:-translate-y-0.5 transition-transform">
      <div className="relative">
        <img src={imageUrl} className="w-full h-40 object-cover" alt="trip" />
        <button
          className="absolute top-2 right-2 p-2 rounded-full bg-black/40 hover:bg-black/60"
          title={t.saved ? "Saved" : "Save"}
          onClick={onToggleSave}
        >
          <svg className={`h-5 w-5 ${t.saved ? "text-accent" : "text-white"}`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 2h12a2 2 0 012 2v18l-8-4-8 4V4a2 2 0 012-2z" />
          </svg>
        </button>
        <span className="absolute bottom-2 left-2 text-xs bg-black/50 rounded-full px-2 py-0.5">{t.type}</span>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{t.title}</h3>
            <div className="text-xs text-textmuted truncate">
              {t.city}, {t.state} • {fmtDate(t.start)} — {fmtDate(t.end)} ({t.days}d)
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm">
              <span className="font-semibold">{t.km}</span>
              <span className="text-xs text-textmuted ml-1">km</span>
            </div>
            <div className="text-[11px] text-textmuted">{left}d left</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full"
            style={{ background: t.diff === "Easy" ? "#22c55e" : t.diff === "Moderate" ? "#f59e0b" : "#ef4444" }} />
          <span className="text-xs">{t.diff}</span>
          <span className="mx-2 h-3 w-px bg-white/15" />
          <span className="text-xs">{t.members}/{t.max} members</span>
          <div className="ml-auto">
            <span className="text-xs bg-white/5 rounded-full px-2 py-0.5">₹{t.budget}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-accent" style={{ width: `${fillPct}%` }} />
          </div>
          <span className="text-xs text-textmuted">{fillPct}%</span>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button onClick={onView} className="rounded-xl px-3 py-2 bg-white/5 border border-border flex-1">View</button>
          <button onClick={onJoin} className="rounded-xl px-3 py-2 bg-accent text-white flex-1">Join</button>
        </div>
      </div>
    </article>
  );
}

/* utils */
function daysLeft(startISO: string) {
  const d = Math.ceil((+new Date(startISO) - Date.now()) / 86400000);
  return d < 0 ? 0 : d;
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: "2-digit", month: "short" });
}
