"use client";

import * as React from "react";
import { Group } from "./types";

type Props = {
  open: boolean;
  onClose: () => void;
  group: Group | null;
};

export default function DetailsPanel({ open, onClose, group }: Props) {
  const g = group;

  return (
    <aside
      id="detailsPanel"
      className={`fixed top-0 right-0 w-[520px] max-w-[95vw] h-full bg-card border-l border-border transform transition-transform duration-300 overflow-y-auto z-50 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="px-4 py-3 border-b border-border flex items-center">
        <div className="font-semibold">Group Details</div>
        <button onClick={onClose} className="ml-auto p-2 rounded-lg hover:bg-white/10" aria-label="Close">
          ✕
        </button>
      </div>

      <div className="p-4 space-y-5 text-sm">
        {/* Header */}
        <div className="flex items-center gap-3">
          <img
            id="dAvatar"
            src={
              g?.avatar ||
              "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
            }
            className="h-12 w-12 rounded-lg"
            alt=""
          />
          <div>
            <div id="dTitle" className="font-semibold text-white">{g?.title || "—"}</div>
            <div id="dMeta" className="text-textmuted text-xs">
              {g ? `${g.members} members • ${g.id.startsWith("g") ? "Private" : "Public"}` : "—"}
            </div>
          </div>
        </div>

        <div>
          <div className="text-textmuted mb-1">Description</div>
          <div id="dDesc" className="text-white/90">{g?.desc || "—"}</div>
        </div>

        {/* Media */}
        <div className="border border-border rounded-xl p-3">
          <div className="font-semibold mb-2">Recent Media</div>
          <div id="dMedia" className="grid grid-cols-3 gap-2">
            {(g?.details.media || []).slice(0, 6).map((src, i) => (
              <img key={i} src={src} className="h-20 w-full object-cover rounded-lg" alt="" />
            ))}
          </div>
          <button className="chip mt-3">View all</button>
        </div>

        {/* Files */}
        <div className="border border-border rounded-xl p-3">
          <div className="font-semibold mb-2">Shared Files</div>
          <div id="dFiles" className="space-y-2">
            {(g?.details.files || []).length ? (
              g?.details.files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 00-2 2v16l4-4h6a2 2 0 002-2V4a2 2 0 00-2-2z"/></svg>
                  <div className="min-w-0 flex-1">
                    <div className="truncate">{f.name}</div>
                    <div className="text-xs text-textmuted">{f.size}</div>
                  </div>
                  <button className="chip">Download</button>
                </div>
              ))
            ) : (
              <div className="text-textmuted">No files shared yet.</div>
            )}
          </div>
        </div>

        {/* Upcoming */}
        <div className="border border-border rounded-xl p-3">
          <div className="font-semibold mb-2">Upcoming</div>
          <div id="dEvents" className="space-y-2">
            {(g?.details.events || []).length ? (
              g?.details.events.map((ev, i) => (
                <div key={i} className="bg-white/5 rounded-lg px-3 py-2">
                  <div className="text-white">{ev.title}</div>
                  <div className="text-xs text-textmuted">{ev.time} • {ev.note || ""}</div>
                </div>
              ))
            ) : (
              <div className="text-textmuted">No upcoming events.</div>
            )}
          </div>
        </div>

        {/* Members */}
        <div className="border border-border rounded-xl p-3">
          <div className="font-semibold mb-2">Members</div>
          <div id="dMembers" className="grid grid-cols-5 gap-2">
            {g
              ? Array.from({ length: Math.min(g.members, 15) }).map((_, i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/64?img=${(i % 70) + 1}`}
                    className="h-10 w-10 rounded-lg"
                    alt=""
                  />
                ))
              : null}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button className="chip">Invite</button>
            <button className="chip">Manage Roles</button>
          </div>
        </div>

        {/* Roles & Rules */}
        <div className="border border-border rounded-xl p-3">
          <div className="font-semibold mb-2">Roles</div>
          <div id="dRoles" className="space-y-1 text-white/90">
            <div>
              <span className="text-textmuted">Admin:</span>{" "}
              {(g?.details.roles.admin || []).join(", ") || "—"}
            </div>
            <div>
              <span className="text-textmuted">Moderators:</span>{" "}
              {(g?.details.roles.mods || []).join(", ") || "—"}
            </div>
          </div>
          <div className="font-semibold mt-4 mb-2">Group Rules</div>
          <ul id="dRules" className="list-disc pl-5 space-y-1 text-white/90">
            {(g?.details.rules || []).length ? (
              g?.details.rules.map((r, i) => <li key={i}>{r}</li>)
            ) : (
              <li>No rules added.</li>
            )}
          </ul>
        </div>

        {/* Expense snapshot */}
        <div className="border border-border rounded-xl p-3">
          <div className="font-semibold mb-2">Expense Snapshot</div>
          <div id="dExpense" className="text-white/90 space-y-1">
            <div>Total: <span className="font-semibold">{g?.details.expense.total || "—"}</span></div>
            <div>You owe: <span className="font-semibold">{g?.details.expense.youOwe || "—"}</span></div>
            <div>You get: <span className="font-semibold">{g?.details.expense.youGet || "—"}</span></div>
          </div>
          <button className="chip mt-2">Open in Expenses</button>
        </div>

        {/* Settings */}
        <div className="border border-border rounded-xl p-3">
          <div className="font-semibold mb-2">Settings</div>
          <label className="flex items-center justify-between text-sm py-1">
            <span>Mute notifications</span>
            <input type="checkbox" className="toggle-orange" />
          </label>
          <label className="flex items-center justify-between text-sm py-1">
            <span>Pin this group</span>
            <input type="checkbox" className="toggle-orange" />
          </label>
          <label className="flex items-center justify-between text-sm py-1">
            <span>Allow join via link</span>
            <input type="checkbox" className="toggle-orange" defaultChecked />
          </label>
          <button className="mt-3 w-full bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2">
            Copy Invite Link
          </button>
          <button className="mt-2 w-full bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2 text-red-400">
            Leave Group
          </button>
        </div>
      </div>
    </aside>
  );
}
