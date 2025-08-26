"use client";

import * as React from "react";
import { Group } from "./types";

type Props = {
  activeTab: "my" | "discover";
  setActiveTab: (t: "my" | "discover") => void;
  search: string;
  setSearch: (v: string) => void;
  myGroups: Group[];
  discoverGroups: Group[];
  onOpenGroup: (g: Group) => void;
};

export default function GroupList({
  activeTab,
  setActiveTab,
  search,
  setSearch,
  myGroups,
  discoverGroups,
  onOpenGroup,
}: Props) {
  const src = activeTab === "my" ? myGroups : discoverGroups;
  const list = src.filter(
    (g) =>
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      (g.desc || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Search + tabs */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-white/5 rounded-xl px-3 py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M15.5 14h-.79l-.28-.27A6.5 6.5 0 1 0 14 15.5l.27.28v.79l5 5 1.5-1.5-5-5zM5 10.5C5 7.46 7.46 5 10.5 5S16 7.46 16 10.5 13.54 16 10.5 16 5 13.54 5 10.5z" />
            </svg>
            <input
              className="bg-transparent outline-none w-full placeholder:text-textmuted"
              placeholder="Search groups"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            className={`flex-1 py-2 rounded-xl font-medium ${
              activeTab === "my" ? "bg-accent text-white" : "bg-white/5 text-white"
            }`}
            data-tab="my"
            aria-selected={activeTab === "my"}
            onClick={() => setActiveTab("my")}
          >
            My Groups{" "}
            <span className="ml-1 text-xs bg-white/20 rounded px-1">
              {myGroups.length}
            </span>
          </button>
          <button
            className={`flex-1 py-2 rounded-xl font-medium ${
              activeTab === "discover" ? "bg-accent text-white" : "bg-white/5 text-white"
            }`}
            data-tab="discover"
            aria-selected={activeTab === "discover"}
            onClick={() => setActiveTab("discover")}
          >
            Discover{" "}
            <span className="ml-1 text-xs bg-white/10 rounded px-1">
              {discoverGroups.length}
            </span>
          </button>
        </div>
      </div>

      {/* Pinned (static demo) */}
      <div className="px-3 pt-3">
        <div className="text-xs uppercase tracking-wide text-textmuted mb-2">
          Pinned
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <button className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-xl text-sm shrink-0 inline-flex items-center gap-2">
            <img
              src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
              className="h-5 w-5 rounded-full"
              alt=""
            />{" "}
            Weekend Riders
          </button>
          <button className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-xl text-sm shrink-0 inline-flex items-center gap-2">
            <img
              src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
              className="h-5 w-5 rounded-full"
              alt=""
            />{" "}
            XPulse Owners
          </button>
        </div>
      </div>

      {/* List */}
      <div
        id="groupsList"
        className="flex-1 overflow-y-auto no-scrollbar divide-y divide-border"
        aria-live="polite"
      >
        {list.length === 0 ? (
          <div className="px-4 py-6 text-sm text-textmuted">No groups.</div>
        ) : (
          list.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => onOpenGroup(g)}
              className="w-full text-left px-4 py-3 hover:bg-white/5 focus:bg-white/10 outline-none"
            >
              <div className="flex items-center gap-3">
                <img src={g.avatar} className="h-10 w-10 rounded-lg" alt="" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium truncate">{g.title}</div>
                    {g.unread ? (
                      <span className="text-[10px] bg-accent text-white rounded-full px-1.5 py-0.5">
                        {g.unread}
                      </span>
                    ) : null}
                  </div>
                  <div className="text-xs text-textmuted truncate">
                    {g.last || ""}
                  </div>
                </div>
                <div className="text-xs text-textmuted">{g.time || ""}</div>
              </div>
            </button>
          ))
        )}
      </div>
    </>
  );
}
