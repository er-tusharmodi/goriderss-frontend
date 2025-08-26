"use client";

import React from "react";
import { useEffect, useState } from "react";
// if you had a type:
// import { Budgets } from "./types";

type Budgets = { personal: number; trip: number; bike: number };

export default function BudgetsCard({
  budgets,
  totals,
  onSave,
}: {
  budgets: Budgets;
  totals: { personal: number; trip: number; bike: number };
  onSave: (b: Budgets) => void;
}) {
  const [local, setLocal] = useState<Budgets>(budgets);
  useEffect(() => setLocal(budgets), [budgets]);

  const Row = ({ label, spent, cap }: { label: string; spent: number; cap: number }) => {
    const pct = cap > 0 ? Math.min(100, Math.round((spent / cap) * 100)) : 0;
    return (
      <div>
        <div className="flex items-center justify-between text-sm mb-1">
          <div>{label}</div>
          <div className="mono">₹{spent.toLocaleString()} / ₹{cap.toLocaleString()}</div>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full" style={{ width: `${pct}%`, background: "#F25C2A" }} />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
      <div className="font-semibold">Budgets</div>

      <div className="space-y-3">
        <Row label="This Trip" spent={totals.trip} cap={local.trip} />
        <Row label="Bike-Life (month)" spent={totals.bike} cap={local.bike} />
        <Row label="Personal (month)" spent={totals.personal} cap={local.personal} />
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <label className="label block">
          <span className="text-textmuted text-xs">Trip Budget (₹)</span>
          <input
            type="number"
            className="field mt-1"
            value={local.trip}
            onChange={(e) => setLocal((b) => ({ ...b, trip: Number(e.target.value) || 0 }))}
          />
        </label>
        <label className="label block">
          <span className="text-textmuted text-xs">Bike-Life / Month (₹)</span>
          <input
            type="number"
            className="field mt-1"
            value={local.bike}
            onChange={(e) => setLocal((b) => ({ ...b, bike: Number(e.target.value) || 0 }))}
          />
        </label>
        <label className="label block col-span-2">
          <span className="text-textmuted text-xs">Personal / Month (₹)</span>
          <input
            type="number"
            className="field mt-1"
            value={local.personal}
            onChange={(e) => setLocal((b) => ({ ...b, personal: Number(e.target.value) || 0 }))}
          />
        </label>

        {/* 🔸 button classes unchanged */}
        <button onClick={() => onSave(local)} className="btn btn-ghost col-span-2">
          Save Budgets
        </button>
      </div>
    </div>
  );
}
