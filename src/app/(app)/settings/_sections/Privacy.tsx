"use client";

import type { SettingsState } from "../SettingsClient";
import Toggle from "../_components/Toggle";

export default function PrivacySection({
  state,
  setState,
}: {
  state: SettingsState;
  setState: React.Dispatch<React.SetStateAction<SettingsState>>;
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="bg-white/5 border border-border rounded-xl p-4 flex items-center justify-between">
        <div>
          <div className="font-medium">Show Email on Profile</div>
          <div className="text-sm text-textmuted">Control if others can see your email.</div>
        </div>
        <Toggle
          checked={state.isEmailDisplay}
          onChange={(v) => setState((s) => ({ ...s, isEmailDisplay: v }))}
          aria-label="Show Email on Profile"
        />
      </div>

      <div className="bg-white/5 border border-border rounded-xl p-4 flex items-center justify-between">
        <div>
          <div className="font-medium">Show Mobile Number</div>
          <div className="text-sm text-textmuted">Hide it to keep it private.</div>
        </div>
        <Toggle
          checked={state.isMobileNumberDisplay}
          onChange={(v) => setState((s) => ({ ...s, isMobileNumberDisplay: v }))}
          aria-label="Show Mobile Number"
        />
      </div>

      <div className="bg-white/5 border border-border rounded-xl p-4 flex items-center justify-between sm:col-span-2">
        <div>
          <div className="font-medium">Show Expenses in Trip Chats</div>
          <div className="text-sm text-textmuted">
            If off, only you can see your expense entries.
          </div>
        </div>
        <Toggle
          checked={state.isExpensesDisplay}
          onChange={(v) => setState((s) => ({ ...s, isExpensesDisplay: v }))}
          aria-label="Show Expenses"
        />
      </div>
    </div>
  );
}
