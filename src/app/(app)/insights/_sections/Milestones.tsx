"use client";

import type { Milestone } from "../types";
import { IconTick } from "../_components/icons";

export default function Milestones({ items }: { items: Milestone[] }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Milestones</h2>
        <span className="inline-flex items-center gap-1 bg-white/10 border border-border rounded-full px-2 py-0.5 text-xs">
          New
        </span>
      </div>
      <div className="space-y-3">
        {items.map((m) => (
          <div key={m.label}>
            <div className="flex items-center gap-2">
              <IconTick className="h-4 w-4 text-white" />
              <div className="font-medium">{m.label}</div>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-accent" style={{ width: `${m.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
