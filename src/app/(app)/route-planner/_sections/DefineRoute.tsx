"use client";

import type { PropsWithChildren } from "react";
import type { PlannerInputs } from "../types";

export default function DefineRoute({
  value,
  onChange,
  onGenerate,
  onAddManual,
  children,
}: PropsWithChildren<{
  value: PlannerInputs;
  onChange: (patch: Partial<PlannerInputs>) => void;
  onGenerate: () => void;
  onAddManual: () => void;
}>) {
  const inputCls =
    "w-full bg-transparent border border-border rounded-xl px-3 py-2 outline-none focus:border-accent focus:ring-4 focus:ring-accent/35 placeholder:text-textmuted";

  return (
    <aside
      className="
        bg-card border border-border rounded-2xl p-4 space-y-4 h-max
        lg:sticky lg:top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar
      "
    >
      <h2 className="font-semibold">Define Route</h2>

      <div className="space-y-3">
        <Labeled label="From">
          <input
            value={value.from}
            onChange={(e) => onChange({ from: e.target.value })}
            className={inputCls + " mt-1"}
            placeholder="e.g. Jaipur, Rajasthan"
          />
        </Labeled>

        <Labeled label="To">
          <input
            value={value.to}
            onChange={(e) => onChange({ to: e.target.value })}
            className={inputCls + " mt-1"}
            placeholder="e.g. Udaipur, Rajasthan"
          />
        </Labeled>

        <div className="grid grid-cols-2 gap-3">
          <Labeled label="Start Date & Time">
            <input
              type="datetime-local"
              value={value.start}
              onChange={(e) => onChange({ start: e.target.value })}
              className={inputCls + " mt-1"}
            />
          </Labeled>
          <Labeled label="Pace">
            <select
              value={value.pace}
              onChange={(e) => onChange({ pace: e.target.value as any })}
              className={inputCls + " mt-1"}
            >
              <option className="bg-slatebg" value="relaxed">Relaxed</option>
              <option className="bg-slatebg" value="normal">Normal</option>
              <option className="bg-slatebg" value="fast">Fast</option>
            </select>
          </Labeled>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Labeled label="Max Leg (km)">
            <input
              type="number"
              min={50}
              max={600}
              value={value.maxLeg}
              onChange={(e) => onChange({ maxLeg: Number(e.target.value || 0) })}
              className={inputCls + " mt-1"}
              placeholder="e.g. 180"
            />
          </Labeled>
          <Labeled label="Prefer">
            <select
              value={value.prefer}
              onChange={(e) => onChange({ prefer: e.target.value as any })}
              className={inputCls + " mt-1"}
            >
              <option className="bg-slatebg" value="scenic">Scenic</option>
              <option className="bg-slatebg" value="fastest">Fastest</option>
              <option className="bg-slatebg" value="food">Good Food Stops</option>
            </select>
          </Labeled>
        </div>

        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.avoidHighways}
              onChange={(e) => onChange({ avoidHighways: e.target.checked })}
              className="accent-accent"
            />
            <span className="text-sm text-textmuted">Avoid Highways</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={value.fuelEvery150}
              onChange={(e) => onChange({ fuelEvery150: e.target.checked })}
              className="accent-accent"
            />
            <span className="text-sm text-textmuted">Fuel every ~150km</span>
          </label>
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={onGenerate} className="flex-1 rounded-xl px-3 py-2 bg-accent text-white">
            Generate with AI
          </button>
          <button onClick={onAddManual} className="rounded-xl px-3 py-2 bg-accent text-white">
            + Manual
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Stats (Plan)</h3>
        {children}
      </div>
    </aside>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-textmuted text-sm">{label}</span>
      {children}
    </label>
  );
}
