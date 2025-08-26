"use client";

import type { Suggestion } from "../types";

export default function Suggestions({
  items,
  onAccept,
  onSkip,
  onAcceptAll,
}: {
  items: Suggestion[];
  onAccept: (index: number) => void;
  onSkip: (index: number) => void;
  onAcceptAll: () => void;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="font-semibold">AI Suggestions</div>
        <button onClick={onAcceptAll} className="rounded-xl px-3 py-2 bg-accent text-white">
          Accept All
        </button>
      </div>
      <div className="p-4 grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {items.length === 0 ? (
          <div className="col-span-full text-sm text-textmuted">
            No suggestions yet. Click “Generate with AI”.
          </div>
        ) : (
          items.map((s, i) => (
            <SugCard key={`${s.title}-${s.km}-${i}`} s={s} onAccept={() => onAccept(i)} onSkip={() => onSkip(i)} />
          ))
        )}
      </div>
    </div>
  );
}

function SugCard({
  s,
  onAccept,
  onSkip,
}: {
  s: Suggestion;
  onAccept: () => void;
  onSkip: () => void;
}) {
  return (
    <article className="bg-white/5 border border-border rounded-2xl overflow-hidden flex flex-col">
      {s.photo ? <img src={s.photo} className="w-full h-28 object-cover" alt="" /> : null}
      <div className="p-3 space-y-2 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-semibold truncate">{s.title}</h4>
          <span className="inline-flex items-center gap-1 bg-white/10 border border-border rounded-full px-2 py-1">
            <span>{s.km}</span>
            <span className="text-textmuted text-[11px]">km</span>
          </span>
        </div>
        {s.description ? (
          <div className="text-sm text-white/90 line-clamp-2">{s.description}</div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {(s.highlights || []).map((h, i) => (
            <span key={i} className="inline-flex items-center gap-1 bg-white/10 border border-border rounded-full px-2 py-1">
              {h}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-textmuted">~ {s.timeToReach} mins</span>
          <div className="flex items-center gap-2">
            <button onClick={onAccept} className="rounded-xl px-3 py-2 bg-accent text-white text-sm">
              Accept
            </button>
            <button onClick={onSkip} className="rounded-xl px-3 py-2 bg-white/5 border border-border text-sm">
              Skip
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
