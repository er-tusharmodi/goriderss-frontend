"use client";

import React, { useEffect, useState } from "react";

type Budgets = { personal: number; trip: number; bike: number };
type Totals = { personal: number; trip: number; bike: number };

// Allowed accent keys we compile classes for
type AccentKey = "indigo" | "emerald" | "rose" | "sky" | "orange";

const ACCENT_HEX: Record<AccentKey, string> = {
  indigo: "#6366F1",
  emerald: "#10B981",
  rose: "#F43F5E",
  sky: "#0EA5E9",
  orange: "#F25C2A",
};

const ACCENT_RING: Record<AccentKey, string> = {
  indigo: "ring-indigo-500/20",
  emerald: "ring-emerald-500/20",
  rose: "ring-rose-500/20",
  sky: "ring-sky-500/20",
  orange: "ring-orange-500/20",
};

function toAccentKey(a?: string): AccentKey {
  const allowed: AccentKey[] = ["indigo", "emerald", "rose", "sky", "orange"];
  return allowed.includes(a as AccentKey) ? (a as AccentKey) : "orange";
}

export default function BudgetsCard({
  budgets,
  totals,
  onSave,
  accent, // optional; any string accepted
}: {
  budgets: Budgets;
  totals: Totals;
  onSave: (b: Budgets) => void;
  accent?: string;
}) {
  const [local, setLocal] = useState<Budgets>(budgets);
  useEffect(() => setLocal(budgets), [budgets]);

  const ak = toAccentKey(accent);
  const barColor = ACCENT_HEX[ak];
  const ringClass = ACCENT_RING[ak];

  const Row = ({ label, spent, cap }: { label: string; spent: number; cap: number }) => {
    const pct = cap > 0 ? Math.min(100, Math.round((spent / cap) * 100)) : 0;
    return (
      <div>
        <div className="mb-1 flex items-center justify-between text-sm">
          <div>{label}</div>
          <div className="mono">
            ₹{spent.toLocaleString()} / ₹{cap.toLocaleString()}
          </div>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full" style={{ width: `${pct}%`, background: barColor }} />
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-3 rounded-2xl border border-border bg-card p-4 ring-1 ${ringClass}`}>
      <div className="font-semibold">Budgets</div>

      <div className="space-y-3">
        <Row label="This Trip" spent={totals.trip} cap={local.trip} />
        <Row label="Bike-Life (month)" spent={totals.bike} cap={local.bike} />
        <Row label="Personal (month)" spent={totals.personal} cap={local.personal} />
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <label className="label block">
          <span className="text-xs text-textmuted">Trip Budget (₹)</span>
          <input
            type="number"
            className="field mt-1"
            value={local.trip}
            onChange={(e) => setLocal((b) => ({ ...b, trip: Number(e.target.value) || 0 }))}
            inputMode="numeric"
          />
        </label>
        <label className="label block">
          <span className="text-xs text-textmuted">Bike-Life / Month (₹)</span>
          <input
            type="number"
            className="field mt-1"
            value={local.bike}
            onChange={(e) => setLocal((b) => ({ ...b, bike: Number(e.target.value) || 0 }))}
            inputMode="numeric"
          />
        </label>
        <label className="label col-span-2 block">
          <span className="text-xs text-textmuted">Personal / Month (₹)</span>
          <input
            type="number"
            className="field mt-1"
            value={local.personal}
            onChange={(e) => setLocal((b) => ({ ...b, personal: Number(e.target.value) || 0 }))}
            inputMode="numeric"
          />
        </label>

        <button onClick={() => onSave(local)} className="btn btn-ghost col-span-2">
          Save Budgets
        </button>
      </div>
    </div>
  );
}
