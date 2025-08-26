"use client";

import { useEffect, useState } from "react";
import type { Checkpoint } from "../types";

export default function EditModal({
  open,
  value,
  onClose,
  onSave,
}: {
  open: boolean;
  value?: Checkpoint;
  onClose: () => void;
  onSave: (updated: Checkpoint) => void;
}) {
  const [form, setForm] = useState<Checkpoint | null>(value ?? null);

  useEffect(() => {
    setForm(value ?? null);
  }, [value]);

  if (!open || !form) return null;

  const inputCls =
    "w-full bg-transparent border border-border rounded-xl px-3 py-2 outline-none focus:border-accent focus:ring-4 focus:ring-accent/35 placeholder:text-textmuted";

  return (
    <div className="fixed inset-0 bg-black/60 z-50" onClick={(e) => e.currentTarget === e.target && onClose()}>
      <div className="mx-auto mt-10 max-w-2xl bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="font-semibold">Edit Checkpoint</div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10">✕</button>
        </div>

        <div className="p-4 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <Labeled label="Title">
              <input
                className={inputCls + " mt-1"}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Checkpoint title"
              />
            </Labeled>
            <Labeled label="Date & Time">
              <input
                type="datetime-local"
                className={inputCls + " mt-1"}
                value={form.dateTime}
                onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
              />
            </Labeled>
          </div>

          <Labeled label="Description">
            <textarea
              rows={2}
              className={inputCls + " mt-1"}
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short note"
            />
          </Labeled>

          <div className="grid sm:grid-cols-3 gap-3">
            <Labeled label="Leg Distance (km)">
              <input
                type="number"
                className={inputCls + " mt-1"}
                min={0}
                value={form.km}
                onChange={(e) => setForm({ ...form, km: Number(e.target.value || 0) })}
              />
            </Labeled>
            <Labeled label="Time to reach (min)">
              <input
                type="number"
                className={inputCls + " mt-1"}
                min={0}
                value={form.timeToReach}
                onChange={(e) => setForm({ ...form, timeToReach: Number(e.target.value || 0) })}
              />
            </Labeled>
            <Labeled label="Details">
              <input
                className={inputCls + " mt-1"}
                value={form.details || ""}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                placeholder="Fuel, Food, Viewpoint…"
              />
            </Labeled>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-border flex items-center justify-end gap-2">
          <button onClick={onClose} className="rounded-xl px-3 py-2 bg-white/5 border border-border">
            Cancel
          </button>
          <button onClick={() => form && onSave(form)} className="rounded-xl px-3 py-2 bg-accent text-white">
            Update
          </button>
        </div>
      </div>
    </div>
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
