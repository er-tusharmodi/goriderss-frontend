"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import PrivacySection from "./_sections/Privacy";
import NotificationsSection from "./_sections/Notifications";
import ChatSection from "./_sections/Chat";
import BlockedSection from "./_sections/Blocked";
import SecuritySection from "./_sections/Security";
import ConnectionsSection from "./_sections/Connections";
import DangerZoneSection from "./_sections/DangerZone";
import Section from "./_components/Section";

/* =========================
   Types
========================= */
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
  // Privacy
  isEmailDisplay: boolean;
  isMobileNumberDisplay: boolean;
  isExpensesDisplay: boolean;

  // Notifications
  notifTripInvites: boolean;
  notifMentions: boolean;
  notifTripReminders: boolean;

  // Chat
  wifiAutoDl: boolean;
  // (from ChatSection optional keys)
  chatMedia?: "Auto" | "High" | "Data Saver";
  readReceipts?: "Enabled" | "Disabled";

  // Security
  twoFA: boolean | { enabled: boolean };

  // Blocked & Sessions (UI only on this page)
  blocked: string[];
  sessions: SessionInfo[];

  // Locale
  lang: string;
  region: string;
  unit: "Kilometers" | "Miles";

  // Header user summary (UI only)
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
  { key: "security", label: "Security" },
  // { key: "connections", label: "Connected Accounts" },
  { key: "danger", label: "Danger Zone", danger: true },
] as const;

const LS_KEY = "goriderss_settings_v2";

export default function SettingsClient({ initial }: Props) {
  const [state, setState] = useState<SettingsState>(initial);
  const [active, setActive] = useState<(typeof CATEGORIES)[number]["key"]>("privacy");
  const [saving, setSaving] = useState(false);

  // Error surface (banner + bullet list)
  const [err, setErr] = useState<string | null>(null);
  const [fieldErrs, setFieldErrs] = useState<string[]>([]);
  const topRef = useRef<HTMLDivElement>(null);

  // ---- hydrate from localStorage once ----
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setState((s) => ({ ...s, ...JSON.parse(raw) }));
    } catch {}
  }, []);

  // ---- persist to localStorage on change ----
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  // ---- Save handler with detailed error surface ----
  async function save() {
    setSaving(true);
    setErr(null);
    setFieldErrs([]);

    // whitelist payload (drop UI-only)
    const { user, sessions, blocked, ...rest } = state as any;

    const payload = {
      // Privacy
      isEmailDisplay: !!rest.isEmailDisplay,
      isMobileNumberDisplay: !!rest.isMobileNumberDisplay,
      isExpensesDisplay: !!rest.isExpensesDisplay,
      // Notifications
      notifTripInvites: !!rest.notifTripInvites,
      notifMentions: !!rest.notifMentions,
      notifTripReminders: !!rest.notifTripReminders,
      // Chat
      chatMedia: (rest.chatMedia ?? "Auto") as "Auto" | "High" | "Data Saver",
      readReceipts: (rest.readReceipts ?? "Enabled") as "Enabled" | "Disabled",
      wifiAutoDl: !!(rest.wifiAutoDl ?? true),
      // Security
      twoFA: { enabled: !!(rest.twoFA?.enabled ?? rest.twoFA ?? false) },
      // Locale
      lang: rest.lang ?? "English (India)",
      region: rest.region ?? "India",
      unit: (rest.unit ?? "Kilometers") as "Kilometers" | "Miles",
    };

    const ac = new AbortController();
    const timeout = window.setTimeout(() => ac.abort(), 12000);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "same-origin",
        signal: ac.signal,
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        // non-JSON, keep raw
      }

      if (!res.ok || data?.success === false) {
        const details: string[] = Array.isArray(data?.errors)
          ? data.errors
              .map((e: any) => e?.msg || e?.message || (e?.field ? `${e.field}: invalid` : null))
              .filter(Boolean)
          : [];

        setFieldErrs(details.slice(0, 5));

        let msg: string | null =
          data?.message || data?.error || data?.errors?.[0]?.message || null;

        if (res.status === 401 || res.status === 403) {
          msg = "You are not authorized. Please log in again.";
        } else if (res.status === 413) {
          msg = "Payload too large. Try reducing the data.";
        } else if (!msg) {
          msg = `Save failed (HTTP ${res.status})`;
        }

        setErr(msg);
        // scroll error into view
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        console.error("Settings save failed:", res.status, text);
        return;
      }

      toast(data?.message || "Settings saved");
    } catch (e: any) {
      if (e?.name === "AbortError") {
        setErr("Request timed out. Check your connection and try again.");
      } else {
        setErr(e?.message || "Network error while saving settings.");
      }
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      console.error("Settings save exception:", e);
    } finally {
      window.clearTimeout(timeout);
      setSaving(false);
    }
  }

  // allow top "Save Changes" button to submit this form
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setFieldErrs([]);
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
            "w-full rounded-xl px-3 py-2 text-left",
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
    <div className="px-4 py-6 sm:px-6">
      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* LEFT: Category Nav */}
        <aside className="h-max rounded-2xl border border-border bg-card p-4 lg:sticky lg:top-24">
          <div className="mb-3 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={state.user.avatar} className="h-10 w-10 rounded-full" alt="" />
            <div>
              <div className="leading-tight font-semibold">{state.user.name}</div>
              <div className="text-xs text-textmuted">{state.user.role}</div>
            </div>
          </div>
          <nav className="space-y-1">{nav}</nav>
        </aside>

        {/* RIGHT: Content */}
        <section className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-5 sm:px-6">
            <h1 ref={topRef} className="text-xl font-bold">
              Settings
            </h1>
            <div className="text-sm text-textmuted">Tune your GoRiderss experience</div>
          </div>

          <form id="settingsForm" onSubmit={onSubmit} className="space-y-6 p-4 sm:p-6">
            {/* Error banner */}
            {(err || fieldErrs.length > 0) && (
              <div
                role="alert"
                aria-live="polite"
                className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm"
              >
                <div className="text-rose-200 font-medium">
                  {err || "Please fix the errors below"}
                </div>
                {fieldErrs.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-rose-300">
                    {fieldErrs.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

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


            {active === "security" && (
              <Section title="Security">
                <SecuritySection state={state} setState={setState} />
              </Section>
            )}

            {/* {active === "connections" && (
              <Section title="Connected Accounts">
                <ConnectionsSection />
              </Section>
            )} */}

            {active === "danger" && (
              <Section title="Danger Zone" accent="text-red-300">
                <DangerZoneSection onDelete={() => toast("Account deletion requested (demo)")} />
              </Section>
            )}

            {/* Sticky save (mobile) */}
            <div className="sticky bottom-3 lg:hidden">
              <div className="rounded-2xl border border-border bg-card/80 p-3 shadow-soft">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-2xl bg-accent py-2 font-semibold text-white disabled:opacity-70"
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

/* ============ tiny helpers ============ */
function toast(msg: string, error = false) {
  const t = document.createElement("div");
  t.className =
    "fixed bottom-4 left-1/2 -translate-x-1/2 rounded-xl border border-border bg-card px-4 py-2 text-sm shadow-soft";
  t.textContent = msg;
  if (error) t.style.color = "#ffb4b4";
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1600);
}
