"use client";

import * as React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (p: { question: string; options: string[]; multi: boolean; durationSec: number }) => void;
};

export default function PollModal({ open, onClose, onCreate }: Props) {
  const [q, setQ] = React.useState("Where should we stop for breakfast?");
  const [opts, setOpts] = React.useState<string[]>(["Dhabha A", "Cafe B"]);
  const [multi, setMulti] = React.useState(false);
  const [dur, setDur] = React.useState(10800);

  React.useEffect(() => {
    if (!open) return;
    setQ("Where should we stop for breakfast?");
    setOpts(["Dhabha A", "Cafe B"]);
    setMulti(false);
    setDur(10800);
  }, [open]);

  if (!open) return null;

  const addOpt = () => setOpts((s) => [...s, ""]);
  const updOpt = (i: number, v: string) =>
    setOpts((s) => s.map((x, idx) => (idx === i ? v : x)));
  const rmOpt = (i: number) =>
    setOpts((s) => (s.length > 1 ? s.filter((_, idx) => idx !== i) : s));

  return (
    <div id="pollWrap" className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative max-w-md mx-auto mt-16 bg-card border border-border rounded-2xl p-5 sm:p-6">
        <div className="flex items-center">
          <div className="text-lg font-semibold">Create Poll</div>
          <button onClick={onClose} className="ml-auto p-2 rounded-2xl hover:bg-white/10">✕</button>
        </div>

        <div className="mt-4 space-y-4">
          <label className="block">
            <span className="text-textmuted text-sm">Question</span>
            <input
              className="field mt-1"
              placeholder="Where should we stop for breakfast?"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>

          <div>
            <div className="text-textmuted text-sm">Options</div>
            <div id="pollOpts" className="space-y-2 mt-1">
              {opts.map((o, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    className="field flex-1"
                    placeholder={`Option ${i + 1}`}
                    value={o}
                    onChange={(e) => updOpt(i, e.target.value)}
                  />
                  <button
                    onClick={() => rmOpt(i)}
                    className="px-2 py-1 bg-white/10 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addOpt}
              className="mt-2 text-xs bg-white/5 hover:bg-white/10 border border-border rounded-xl px-2.5 py-1.5"
            >
              + Add option
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="toggle-orange"
                checked={multi}
                onChange={(e) => setMulti(e.target.checked)}
              />
              <span className="text-sm">Allow multiple choice</span>
            </label>
            <label className="block">
              <span className="text-textmuted text-sm">Duration</span>
              <select
                className="field mt-1"
                value={dur}
                onChange={(e) => setDur(parseInt(e.target.value, 10))}
              >
                <option className="bg-slatebg" value={3600}>1 hour</option>
                <option className="bg-slatebg" value={10800}>3 hours</option>
                <option className="bg-slatebg" value={86400}>1 day</option>
                <option className="bg-slatebg" value={259200}>3 days</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button onClick={onClose} className="rounded-2xl px-4 py-2 bg-white/5 border border-border hover:bg-white/10">
            Cancel
          </button>
          <button
            onClick={() =>
              onCreate({
                question: q.trim() || "Untitled poll",
                options: opts.map((x) => x.trim()).filter(Boolean),
                multi,
                durationSec: dur,
              })
            }
            className="rounded-2xl px-5 py-2 bg-accent text-white font-semibold"
          >
            Create Poll
          </button>
        </div>
      </div>
    </div>
  );
}
