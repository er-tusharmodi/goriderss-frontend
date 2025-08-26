"use client";

import type { SettingsState } from "../SettingsClient";
import Toggle from "../_components/Toggle";
import { FieldLabel, TextInput } from "../_components/Field";

export default function SecuritySection({
  state,
  setState,
}: {
  state: SettingsState;
  setState: React.Dispatch<React.SetStateAction<SettingsState>>;
}) {
  return (
    <>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <FieldLabel>Current Password</FieldLabel>
          <TextInput className="mt-1" type="password" autoComplete="current-password" />
        </label>
        <label className="block">
          <FieldLabel>New Password</FieldLabel>
          <TextInput className="mt-1" type="password" autoComplete="new-password" />
        </label>
        <label className="block sm:col-span-2">
          <FieldLabel>Confirm New Password</FieldLabel>
          <TextInput className="mt-1" type="password" autoComplete="new-password" />
        </label>
      </div>

      <div className="bg-white/5 border border-border rounded-xl p-4 flex items-center justify-between">
        <div>
          <div className="font-medium">Two-Factor Authentication</div>
          <div className="text-sm text-textmuted">Add an extra layer of security.</div>
        </div>
        <Toggle
          checked={state.twoFA}
          onChange={(v) => setState((s) => ({ ...s, twoFA: v }))}
          aria-label="Two-Factor Authentication"
        />
      </div>
    </>
  );
}
