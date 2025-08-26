"use client";

import type { Leader } from "../types";

export default function Leaderboard({ rows = [] }: { rows: Leader[] }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">Leaderboard (Friends)</h2>
        <span className="text-xs text-textmuted">This month</span>
      </div>

      {rows.length === 0 ? (
        <div className="py-10 text-center text-textmuted text-sm">No leaderboard data</div>
      ) : (
        <div className="divide-y divide-border text-sm">
          {rows.map((row) => (
            <LeaderboardRow key={row.rank} row={row} />
          ))}
        </div>
      )}
    </div>
  );
}

function LeaderboardRow({ row }: { row: Leader }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="w-6 text-center font-semibold">{row.rank}</span>

      <Avatar src={row.avatar} name={row.name} />

      <div className="flex-1 min-w-0">
        <div className="truncate">{row.name}</div>
        <div className="text-xs text-textmuted">{formatKm(row.km)} km</div>
      </div>

      <span className="inline-flex items-center gap-1 bg-white/10 border border-border rounded-full px-2 py-0.5 text-xs">
        +{row.rides} rides
      </span>
    </div>
  );
}

function Avatar({ src, name }: { src?: string; name: string }) {
  return src ? (
    <img src={src} alt={name} className="h-8 w-8 rounded-full object-cover" />
  ) : (
    <div className="h-8 w-8 rounded-full bg-white/10 border border-border grid place-items-center">
      <span className="text-xs">{name.charAt(0).toUpperCase()}</span>
    </div>
  );
}

function formatKm(n: number) {
  return new Intl.NumberFormat("en-IN").format(n);
}
