"use client";

import { useEffect, useMemo, useState } from "react";
import PrivacySection from "./_sections/Privacy";
import NotificationsSection from "./_sections/Notifications";
import ChatSection from "./_sections/Chat";
import BlockedSection from "./_sections/Blocked";
import SessionsSection from "./_sections/Sessions";
import SecuritySection from "./_sections/Security";
import ConnectionsSection from "./_sections/Connections";
import LanguageRegionSection from "./_sections/LanguageRegion";
import HelpSupportSection from "./_sections/HelpSupport";
import DangerZoneSection from "./_sections/DangerZone";
import Section from "./_components/Section";

export type SessionInfo = {
  device: string;
  loc: string;
  last: string;
  current: boolean;
};

export type UserInfo = {
  name: string;
  role: string;
  avatar: string;
};

export type SettingsState = {
  isEmailDisplay: boolean;
  isMobileNumberDisplay: boolean;
  isExpensesDisplay: boolean;

  notifTripInvites: boolean;
  notifMentions: boolean;
  notifTripReminders: boolean;

  wifiAutoDl: boolean;

  twoFA: boolean;

  blocked: string[];
  sessions: SessionInfo[];

  lang: string;
  region: string;
  unit: "Kilometers" | "Miles";

  user: UserInfo;
};

type Props = {
  initial: SettingsState;
};

type Category = {
  key: string;
  label: string;
  danger?: boolean;
};

const CATEGORIES: readonly Category[] = [
  { key: "privacy", label: "Privacy" },
  { key: "notifications", label: "Notifications" },
  { key: "chat", label: "Chat" },
  { key: "blocked", label: "Blocked Users" },
  { key: "sessions", label: "Sessions" },
  { key: "security", label: "Security" },
  { key: "connections", label: "Connected Accounts" },
  { key: "language", label: "Language & Region" },
  { key: "help", label: "Help & Support" },
  { key: "danger", label: "Danger Zone", danger: true },
] as const;

const LS_KEY = "goriderss_settings_v2";

export default function SettingsClient({ initial }: Props) {
  const [state, setState] = useState<SettingsState>(initial);
  const [active, setActive] = useState<(typeof CATEGORIES)[number]["key"]>("privacy");
  const [saving, setSaving] = useState(false);

  // hydrate from localStorage once (client only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setState((s) => ({ ...s, ...JSON.parse(raw) }));
    } catch {}
  }, []);

  // persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  async function save() {
    setSaving(true);
    try {
      // TODO: wire to real API route
      await fakeNetwork(state);
      toast("Settings saved");
    } catch {
      toast("Failed to save", true);
    } finally {
      setSaving(false);
    }
  }

  // allow top "Save Changes" button to submit
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void save();
  }

  const nav = useMemo(
    () =>
      CATEGORIES.map((c) => (
        <button
          key={c.key}
          onClick={() => {
            setActive(c.key);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={[
            "w-full text-left px-3 py-2 rounded-xl",
            active === c.key ? "bg-white/10" : "hover:bg-white/5",
            c.danger ? "text-red-300" : "",
          ].join(" ")}
        >
          {c.label}
        </button>
      )),
    [active]
  );

  return (
    <div className="px-4 sm:px-6 py-6">
      <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] gap-4">
        {/* LEFT: Category Nav */}
        <aside className="bg-card border border-border rounded-2xl p-4 h-max lg:sticky lg:top-24">
          <div className="flex items-center gap-3 mb-3">
            <img src={state.user.avatar} className="h-10 w-10 rounded-full" alt="" />
            <div>
              <div className="font-semibold leading-tight">{state.user.name}</div>
              <div className="text-xs text-textmuted">{state.user.role}</div>
            </div>
          </div>
          <nav className="space-y-1">{nav}</nav>
        </aside>

        {/* RIGHT: Content */}
        <section className="bg-card border border-border rounded-2xl">
          <div className="px-4 sm:px-6 py-5 border-b border-border flex items-center justify-between">
            <h1 className="text-xl font-bold">Settings</h1>
            <div className="text-sm text-textmuted">Tune your GoRiderss experience</div>
          </div>

          <form id="settingsForm" onSubmit={onSubmit} className="p-4 sm:p-6 space-y-6">
            {active === "privacy" && (
              <Section title="Privacy">
                <PrivacySection state={state} setState={setState} />
              </Section>
            )}
            {active === "notifications" && (
              <Section title="Notifications">
                <NotificationsSection state={state} setState={setState} />
              </Section>
            )}
            {active === "chat" && (
              <Section title="Chat">
                <ChatSection state={state} setState={setState} />
              </Section>
            )}
            {active === "blocked" && (
              <Section title="Blocked Users">
                <BlockedSection state={state} setState={setState} />
              </Section>
            )}
            {active === "sessions" && (
              <Section title="Sessions (Active Devices)">
                <SessionsSection state={state} setState={setState} />
              </Section>
            )}
            {active === "security" && (
              <Section title="Security">
                <SecuritySection state={state} setState={setState} />
              </Section>
            )}
            {active === "connections" && (
              <Section title="Connected Accounts">
                <ConnectionsSection />
              </Section>
            )}
            {active === "language" && (
              <Section title="Language & Region">
                <LanguageRegionSection state={state} setState={setState} />
              </Section>
            )}
            {active === "help" && (
              <Section title="Help & Support">
                <HelpSupportSection />
              </Section>
            )}
            {active === "danger" && (
              <Section title="Danger Zone" accent="text-red-300">
                <DangerZoneSection onDelete={() => toast("Account deletion requested (demo)")} />
              </Section>
            )}

            {/* Sticky save (mobile) */}
            <div className="lg:hidden sticky bottom-3">
              <div className="bg-card/80 backdrop-blur border border-border rounded-2xl p-3 shadow-soft">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2 rounded-2xl bg-accent text-white font-semibold disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

// --- tiny helpers (local-only) ---
function toast(msg: string, error = false) {
  const t = document.createElement("div");
  t.className =
    "fixed bottom-4 left-1/2 -translate-x-1/2 bg-card border border-border rounded-xl px-4 py-2 shadow-soft text-sm";
  t.textContent = msg;
  if (error) t.style.color = "#ffb4b4";
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1500);
}

function fakeNetwork<T>(v: T) {
  return new Promise<T>((res) => setTimeout(() => res(v), 350));
}
