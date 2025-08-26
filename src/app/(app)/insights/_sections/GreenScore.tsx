"use client";

import { MiniCard } from "../_components/cards";
import { THEME } from "../types";

export default function GreenScore({
  score,
  co2,
  badgeLevel,
}: {
  score: number;
  co2: number;
  badgeLevel: number;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">Green Score 🌱</h2>
        <div className="text-xs text-textmuted">Eco impact</div>
      </div>

      <div className="flex items-center justify-center py-4">
        <div className="grid place-items-center" style={{ width: 120, height: 120 }}>
          <div
            className="rounded-full grid place-items-center"
            style={{
              width: 120,
              height: 120,
              background: `radial-gradient(closest-side, #253341 78%, transparent 80% 100%), conic-gradient(${THEME.ACCENT} ${score}%, rgba(255,255,255,.08) 0)`,
            }}
          >
            <div
              className="rounded-full border border-border grid place-items-center font-bold"
              style={{ width: 88, height: 88, background: "#253341" }}
            >
              {score}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <MiniCard label="CO₂ Saved" value={`${co2} kg`} />
        <MiniCard label="Eco Badge" value={`Level ${badgeLevel}`} />
      </div>
    </div>
  );
}
