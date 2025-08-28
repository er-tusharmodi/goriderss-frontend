"use client";

import * as React from "react";
import GroupList from "./_sections/GroupList";
import Chat from "./_sections/Chat";
import DetailsPanel from "./_sections/DetailsPanel";
import CreateGroupModal from "./_sections/CreateGroupModal";
import PollModal from "./_sections/PollModal";
import { Group, Message } from "./_sections/types";

export default function GroupsClient() {
  // ===== Dummy data (same as your HTML) =====
  const myGroupsInit: Group[] = [
    {
      id: "g1",
      title: "Weekend Riders",
      members: 18,
      avatar:
        "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
      desc: "Early morning highway loops around Jaipur. Pace: relaxed.",
      last: "Meet 6am sharp!",
      time: "1h",
      unread: 3,
      details: {
        media: [1, 2, 3, 4, 5, 6].map((i) => `https://i.pravatar.cc/300?img=${i}`),
        files: [
          { name: "Route-2025-NorthLoop.gpx", size: "184 KB" },
          { name: "Checklist.pdf", size: "96 KB" },
          { name: "StayOptions.xlsx", size: "41 KB" },
        ],
        events: [
          { title: "Practice ride", time: "Sat, 6:00 AM", note: "NH48 toll meet" },
          { title: "Breakfast halt", time: "Sat, 8:10 AM", note: "Mohan Dhabha" },
        ],
        roles: { admin: ["Tushar"], mods: ["Anushka", "Karan"] },
        rules: ["Be on time", "Ride in staggered formation", "No speeding inside city"],
        expense: { total: "₹12,340", youOwe: "₹480", youGet: "₹0" },
        pinned: "Use lane 2 near toll.",
      },
    },
    {
      id: "g2",
      title: "XPulse Owners",
      members: 142,
      avatar:
        "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
      desc: "Maintenance & mods for XPulse. Share builds, parts & setup.",
      last: "Chain lube tips",
      time: "3h",
      unread: 0,
      details: {
        media: [7, 8, 9, 10, 11, 12].map((i) => `https://i.pravatar.cc/300?img=${i}`),
        files: [
          { name: "ServiceIntervals.png", size: "320 KB" },
          { name: "SprocketGuide.pdf", size: "210 KB" },
        ],
        events: [{ title: "Trail day", time: "Sun, 7:00 AM", note: "Sand practice" }],
        roles: { admin: ["Isha"], mods: ["Vikram"] },
        rules: ["Be respectful", "Tag your bike year", "No spam"],
        expense: { total: "—", youOwe: "—", youGet: "—" },
        pinned: null,
      },
    },
    {
      id: "g3",
      title: "Rajasthan Trail Crew",
      members: 54,
      avatar:
        "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
      desc: "Sand practice and routes across Thar. Recovery & safety focused.",
      last: "Photos from last ride",
      time: "1d",
      unread: 2,
      details: {
        media: [13, 14, 15, 16, 17, 18].map((i) => `https://i.pravatar.cc/300?img=${i}`),
        files: [{ name: "TyrePressures.jpg", size: "120 KB" }],
        events: [{ title: "Night camp", time: "Fri, 9:00 PM", note: "Sam dunes" }],
        roles: { admin: ["Raj"], mods: ["Meera", "Arihant"] },
        rules: ["Buddy system", "Carry 3L water", "Radio on ch 3"],
        expense: { total: "₹3,980", youOwe: "₹0", youGet: "₹560" },
        pinned: "Bring extra tubes.",
      },
    },
  ];

  const discoverInit: Group[] = [
    {
      id: "d1",
      title: "Cafe Racers India",
      members: 220,
      avatar:
        "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
      desc: "Builds, parts, rides.",
      last: "Sunday meet",
      time: "4h",
      unread: 0,
      details: {
        media: [19, 20, 21].map((i) => `https://i.pravatar.cc/300?img=${i}`),
        files: [],
        events: [],
        roles: { admin: ["Dev"], mods: [] },
        rules: ["Keep it clean"],
        expense: { total: "—", youOwe: "—", youGet: "—" },
        pinned: null,
      },
    },
    {
      id: "d2",
      title: "Monsoon Explorers",
      members: 89,
      avatar:
        "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
      desc: "Best rainy routes.",
      last: "Water crossings 101",
      time: "8h",
      unread: 0,
      details: {
        media: [22, 23, 24].map((i) => `https://i.pravatar.cc/300?img=${i}`),
        files: [{ name: "RainGearList.txt", size: "4 KB" }],
        events: [{ title: "Ghat run", time: "Tue 5:30 AM", note: "Caution: moss" }],
        roles: { admin: ["Neeraj"], mods: [] },
        rules: ["Lights on", "Wet braking distance"],
        expense: { total: "—", youOwe: "—", youGet: "—" },
        pinned: "Avoid low bridges.",
      },
    },
  ];

  const initialMsgs: Record<string, Message[]> = {
    g1: [
      { me: false, text: "Meet 6am sharp!", time: "09:10" },
      { me: true, text: "Roger that ✅", time: "09:12" },
      { me: false, text: "Pinning route link.", time: "09:13", pin: true },
    ],
    g2: [
      { me: false, text: "Chain lube tips", time: "11:45" },
      { me: true, text: "Using Motul works well.", time: "11:46" },
    ],
    g3: [{ me: false, text: "Photos from last ride", time: "Yesterday" }],
  };

  // ===== State =====
  const [activeTab, setActiveTab] = React.useState<"my" | "discover">("my");
  const [myGroups, setMyGroups] = React.useState<Group[]>(myGroupsInit);
  const [discoverGroups, setDiscoverGroups] = React.useState<Group[]>(discoverInit);
  const [search, setSearch] = React.useState("");
  const [currentGroup, setCurrentGroup] = React.useState<Group | null>(myGroupsInit[0]);
  const [messages, setMessages] = React.useState<Record<string, Message[]>>(initialMsgs);

  // panels/modals
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [pollOpen, setPollOpen] = React.useState(false);

  // ===== Handlers =====
  const openGroup = (g: Group) => {
    setCurrentGroup(g);
    setDetailsOpen(false);
  };

  const sendMessage = (text: string) => {
    if (!currentGroup) return;
    const id = currentGroup.id;
    setMessages((prev) => ({
      ...prev,
      [id]: [
        ...(prev[id] || []),
        {
          me: true,
          text,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    }));
  };

  const addExpenseBubble = () => {
    if (!currentGroup) return;
    const id = currentGroup.id;
    setMessages((prev) => ({
      ...prev,
      [id]: [
        ...(prev[id] || []),
        {
          me: true,
          text: "💸 Expense Added\n₹1,250 • Lunch @ Dhabha • Split 1/5",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    }));
  };

  const createGroup = (payload: { name: string; desc: string; privacy: "public" | "private" }) => {
    const g: Group = {
      id: "g" + (myGroups.length + 1),
      title: payload.name || "New Group",
      members: 1 + Math.floor(Math.random() * 30),
      avatar:
        "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
      desc: payload.desc || "—",
      last: "Group created",
      time: "now",
      unread: 0,
      details: {
        media: [25, 26, 27].map((i) => `https://i.pravatar.cc/300?img=${i}`),
        files: [],
        events: [],
        roles: { admin: ["You"], mods: [] },
        rules: [],
        expense: { total: "—", youOwe: "—", youGet: "—" },
        pinned: null,
      },
    };
    setMyGroups((s) => [g, ...s]);
    setActiveTab("my");
    setCurrentGroup(g);
    setCreateOpen(false);
  };

  const createPoll = (data: { question: string; options: string[]; multi: boolean; durationSec: number; }) => {
    if (!currentGroup) return;
    const ends = new Date(Date.now() + data.durationSec * 1000).toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    });
    const block =
      `📊 ${data.question}\n` +
      `${data.multi ? "Multiple choice" : "Single choice"} • Ends ${ends}\n` +
      data.options.map((o) => `• ${o}`).join("\n");
    const id = currentGroup.id;
    setMessages((prev) => ({
      ...prev,
      [id]: [
        ...(prev[id] || []),
        {
          me: true,
          text: block,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    }));
    setPollOpen(false);
  };

  // ===== UI =====
  return (
    <div className="bg-slatebg text-white min-h-screen">
      {/* Header (sticky) */}
      <header className="sticky top-0 z-30 bg-slatebg/90 border-b border-border">
        <div className="px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="text-xl font-semibold">Groups</div>
          <div className="flex-1" />
          <button
            onClick={() => setCreateOpen(true)}
            className="bg-accent text-white rounded-2xl px-4 py-2 font-medium"
          >
            + Create Group
          </button>
        </div>
      </header>

      <main className="px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-[320px_minmax(0,1fr)] gap-4">
          {/* LEFT: List */}
          <aside className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
            <GroupList
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              search={search}
              setSearch={setSearch}
              myGroups={myGroups}
              discoverGroups={discoverGroups}
              onOpenGroup={openGroup}
            />
          </aside>

          {/* CENTER: Chat */}
          <section className="bg-card border border-border rounded-2xl flex flex-col min-h-[75vh] lg:min-h-[80vh]">
            <Chat
              group={currentGroup}
              messages={currentGroup ? messages[currentGroup.id] || [] : []}
              onOpenDetails={() => setDetailsOpen(true)}
              onSend={sendMessage}
              onAddExpense={addExpenseBubble}
              onOpenPoll={() => currentGroup && setPollOpen(true)}
            />
          </section>

          {/* RIGHT SLIDE: Details (fixed, rendered once) */}
          <DetailsPanel
            open={detailsOpen}
            onClose={() => setDetailsOpen(false)}
            group={currentGroup}
          />
        </div>
      </main>

      {/* Modals */}
      <CreateGroupModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createGroup}
      />
      <PollModal
        open={pollOpen}
        onClose={() => setPollOpen(false)}
        onCreate={createPoll}
      />
    </div>
  );
}
