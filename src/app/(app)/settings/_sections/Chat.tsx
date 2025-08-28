"use client";

import type { SettingsState } from "../SettingsClient";
import { FieldLabel, Select } from "../_components/Field";
import Toggle from "../_components/Toggle";

export default function ChatSection({
  state,
  setState,
}: {
  state: SettingsState;
  setState: React.Dispatch<React.SetStateAction<SettingsState>>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block">
        <FieldLabel>Default media quality</FieldLabel>
        <Select
          className="mt-1"
          value={(state as any).chatMedia ?? "Auto"}
          onChange={(e) => setState((s) => ({ ...s, chatMedia: e.target.value } as any))}
        >
          <option className="bg-slatebg">Auto</option>
          <option className="bg-slatebg">High</option>
          <option className="bg-slatebg">Data Saver</option>
        </Select>
      </label>

      <label className="block">
        <FieldLabel>Read Receipts</FieldLabel>
        <Select
          className="mt-1"
          value={(state as any).readReceipts ?? "Enabled"}
          onChange={(e) => setState((s) => ({ ...s, readReceipts: e.target.value } as any))}
        >
          <option className="bg-slatebg">Enabled</option>
          <option className="bg-slatebg">Disabled</option>
        </Select>
      </label>

      <div className="sm:col-span-2 flex items-center justify-between rounded-xl border border-border bg-white/5 p-4">
        <div>
          <div className="font-medium">Auto-download on Wi-Fi</div>
          <div className="text-sm text-textmuted">Media will auto-download when you are on Wi-Fi.</div>
        </div>
        <Toggle
          checked={!!state.wifiAutoDl}
          onChange={(v) => setState((s) => ({ ...s, wifiAutoDl: v }))}
          aria-label="Auto-download on Wi-Fi"
        />
      </div>
    </div>
  );
}
