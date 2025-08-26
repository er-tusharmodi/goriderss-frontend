"use client";

import { useMemo, useState } from "react";
import type { SettingsState } from "../SettingsClient";
import { CardRow, TextInput } from "../_components/Field";

export default function BlockedSection({
  state,
  setState,
}: {
  state: SettingsState;
  setState: React.Dispatch<React.SetStateAction<SettingsState>>;
}) {
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");

  const filtered = useMemo(
    () => (state.blocked ?? []).filter((n) => n.toLowerCase().includes(q.toLowerCase())),
    [q, state.blocked]
  );

  function add() {
    const v = name.trim();
    if (!v) return;
    setState((s) => ({ ...s, blocked: [...(s.blocked ?? []), v] }));
    setName("");
    setAdding(false);
  }

  function remove(i: number) {
    setState((s) => {
      const next = [...(s.blocked ?? [])];
      next.splice(i, 1);
      return { ...s, blocked: next };
    });
  }

  return (
    <CardRow>
      <div className="flex items-center gap-3 mb-3">
        <TextInput
          placeholder="Search blocked users"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1"
        />
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="px-3 py-2 rounded-xl bg-accent text-white text-sm"
        >
          {adding ? "Cancel" : "+ Block"}
        </button>
      </div>

      <ul className="divide-y divide-border">
        {filtered.map((name, idx) => (
          <li key={name} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <img
                src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                className="h-8 w-8 rounded-full"
                alt=""
              />
              <div>
                <div className="font-medium">{name}</div>
                <div className="text-xs text-textmuted">Blocked</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] bg-white/10 border border-border px-2 py-[2px] rounded-full">
                Muted
              </span>
              <button
                onClick={() => remove(state.blocked.indexOf(name))}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm"
              >
                Unblock
              </button>
            </div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="py-6 text-center text-textmuted text-sm">No results</li>
        )}
      </ul>

      {adding && (
        <div className="mt-3 grid sm:grid-cols-[1fr_auto] gap-2">
          <TextInput
            placeholder="Username or phone"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={add} className="px-3 py-2 rounded-xl bg-accent text-white">
            Block
          </button>
        </div>
      )}
    </CardRow>
  );
}
