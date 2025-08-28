"use client";

import type { SettingsState } from "../SettingsClient";
import Toggle from "../_components/Toggle";

export default function NotificationsSection({
  state,
  setState,
}: {
  state: SettingsState;
  setState: React.Dispatch<React.SetStateAction<SettingsState>>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Row
        title="Trip Invites"
        desc="When someone invites you to a trip."
        checked={state.notifTripInvites}
        onChange={(v) => setState((s) => ({ ...s, notifTripInvites: v }))}
      />
      <Row
        title="Mentions in Chat"
        desc="Get notified on @mentions."
        checked={state.notifMentions}
        onChange={(v) => setState((s) => ({ ...s, notifMentions: v }))}
      />
      <Row
        className="sm:col-span-2"
        title="Trip Reminders"
        desc="Before your trip starts."
        checked={state.notifTripReminders}
        onChange={(v) => setState((s) => ({ ...s, notifTripReminders: v }))}
      />
    </div>
  );
}

function Row({
  title,
  desc,
  checked,
  onChange,
  className,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  className?: string;
}) {
  return (
    <div className={["flex items-center justify-between rounded-xl border border-border bg-white/5 p-4", className ?? ""].join(" ")}>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-textmuted">{desc}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} aria-label={title} />
    </div>
  );
}
