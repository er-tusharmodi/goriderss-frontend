"use client";

import type { Checkpoint } from "../types";

export default function PlanList({
  items,
  onRemove,
  onEdit,
  onReorder,
}: {
  items: Checkpoint[];
  onRemove: (index: number) => void;
  onEdit: (index: number) => void;
  onReorder: (from: number, to: number) => void;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="font-semibold">Your Plan (Drag to reorder)</div>
        <div className="text-xs text-textmuted">
          Fields: title, description, dateTime, km, timeToReach, details
        </div>
      </div>

      <div className="p-4 space-y-3 min-h-[80px]">
        {items.length === 0 ? (
          <div className="text-sm text-textmuted">No checkpoints added yet.</div>
        ) : (
          items.map((p, i) => (
            <PlanCard
              key={`${p.title}-${i}`}
              idx={i}
              data={p}
              onRemove={() => onRemove(i)}
              onEdit={() => onEdit(i)}
              onReorder={onReorder}
            />
          ))
        )}
      </div>
    </div>
  );
}

function PlanCard({
  idx,
  data: p,
  onRemove,
  onEdit,
  onReorder,
}: {
  idx: number;
  data: Checkpoint;
  onRemove: () => void;
  onEdit: () => void;
  onReorder: (from: number, to: number) => void;
}) {
  function handleDragStart(e: React.DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData("text/plain", String(idx));
    e.currentTarget.classList.add("opacity-60");
  }
  function handleDragEnd(e: React.DragEvent<HTMLDivElement>) {
    e.currentTarget.classList.remove("opacity-60");
  }
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }
  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const from = Number(e.dataTransfer.getData("text/plain"));
    const to = idx;
    if (!Number.isNaN(from) && from !== to) onReorder(from, to);
  }

  return (
    <div
      className="border border-border rounded-2xl p-3 bg-white/5"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-start gap-3">
        {p.photo ? <img src={p.photo} className="h-14 w-20 rounded-lg object-cover" alt="" /> : null}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="font-semibold truncate">{p.title || "Checkpoint"}</div>
              {p.description ? (
                <div className="text-xs text-textmuted truncate">{p.description}</div>
              ) : null}
            </div>
            <div className="text-right shrink-0">
              <div className="inline-flex items-center gap-1 bg-white/10 border border-border rounded-full px-2 py-1">
                <span>{p.km || 0}</span>
                <span className="text-[11px] text-textmuted ml-1">km</span>
              </div>
              <div className="text-[11px] text-textmuted mt-1">~{p.timeToReach || 0}m</div>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {(p.highlights || []).map((h, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 bg-white/10 border border-border rounded-full px-2 py-1"
              >
                {h}
              </span>
            ))}
            {p.details ? (
              <span className="inline-flex items-center gap-1 bg-white/10 border border-border rounded-full px-2 py-1">
                {p.details}
              </span>
            ) : null}
          </div>

          {p.dateTime ? (
            <div className="mt-2 text-xs text-textmuted">
              ETA: <span className="text-white">{new Date(p.dateTime).toLocaleString()}</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-textmuted">Drag handle</div>
        <div className="flex items-center gap-2">
          <button onClick={onEdit} className="rounded-xl px-3 py-2 bg-white/5 border border-border text-sm">
            Edit
          </button>
          <button onClick={onRemove} className="rounded-xl px-3 py-2 bg-white/5 border border-border text-sm">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
