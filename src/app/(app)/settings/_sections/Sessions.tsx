"use client";

import type { SettingsState, SessionInfo } from "../SettingsClient";
import { CardRow } from "../_components/Field";

export default function SessionsSection({
  state,
  setState,
}: {
  state: SettingsState;
  setState: React.Dispatch<React.SetStateAction<SettingsState>>;
}) {
  function kick(i: number) {
    setState((s) => {
      const next = [...(s.sessions ?? [])];
      next.splice(i, 1);
      return { ...s, sessions: next };
    });
  }

  function logoutAll() {
    if (!confirm("Log out from all devices?")) return;
    setState((s) => ({ ...s, sessions: (s.sessions ?? []).filter((x) => x.current) }));
  }

  return (
    <CardRow>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-textmuted">
          Manage devices logged into your account.
        </div>
        <button
          onClick={logoutAll}
          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15"
        >
          Log out all
        </button>
      </div>

      <ul className="divide-y divide-border">
        {(state.sessions ?? []).map((s: SessionInfo, i) => (
          <li key={`${s.device}-${i}`} className="py-3 flex items-center justify-between">
            <div>
              <div className="font-medium">
                {s.device} {s.current ? <Badge>Current</Badge> : null}
              </div>
              <div className="text-xs text-textmuted">
                {s.loc} • Last active: {s.last}
              </div>
            </div>
            <button
              onClick={() => kick(i)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm"
            >
              Log out
            </button>
          </li>
        ))}
      </ul>
    </CardRow>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-2 text-[11px] bg-white/10 border border-border px-2 py-[2px] rounded-full align-middle">
      {children}
    </span>
  );
}
