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
    <div className="grid sm:grid-cols-2 gap-4">
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
    <div
      className={[
        "bg-white/5 border border-border rounded-xl p-4 flex items-center justify-between",
        className ?? "",
      ].join(" ")}
    >
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-textmuted">{desc}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} aria-label={title} />
    </div>
  );
}
