"use client";

import * as React from "react";
import { Group, Message } from "./types";

function highlightMentions(t: string) {
  return t.replace(/(^|\s)@([\w.-]+)/g, '$1<span class="text-accent">@$2</span>');
}

type Props = {
  group: Group | null;
  messages: Message[];
  onOpenDetails: () => void;
  onSend: (text: string) => void;
  onAddExpense: () => void;
  onOpenPoll: () => void;
};

export default function Chat({
  group,
  messages,
  onOpenDetails,
  onSend,
  onAddExpense,
  onOpenPoll,
}: Props) {
  const [val, setVal] = React.useState("");
  const [attachOpen, setAttachOpen] = React.useState(false);
  const [moreOpen, setMoreOpen] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "auto" });
  }, [group, messages.length]);

  const pinned = messages.find((m) => m.pin)?.text;

  return (
    <>
      {/* Chat header */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-3 sticky top-0 z-10 bg-card/95 backdrop-blur">
        <img
          id="chatGrpAvatar"
          src={
            group?.avatar ||
            "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
          }
          className="h-10 w-10 rounded-lg"
          alt=""
        />
        <div className="min-w-0 flex-1">
          <div className="font-semibold truncate" id="chatGrpTitle">
            {group ? group.title : "Select a group"}
          </div>
          <div className="text-xs text-textmuted" id="chatGrpMeta">
            {group ? `${group.members} members` : "—"}
          </div>
        </div>

        {/* 3-dots */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMoreOpen((s) => !s);
              setAttachOpen(false);
            }}
            className="p-2 rounded-lg hover:bg-white/10"
            title="More"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z"/></svg>
          </button>
          <div
            className={`${
              moreOpen ? "" : "hidden"
            } absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl p-1 menu`}
          >
            <button className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg text-sm">Settings</button>
            <button className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg text-sm">Mute</button>
            <button className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg text-sm">Trip Info</button>
            <button className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg text-sm text-red-400">Exit Group</button>
          </div>
        </div>

        <button
          onClick={onOpenDetails}
          className="p-2 rounded-lg hover:bg-white/10"
          title="Group details"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7a5 5 0 015 5v5H7v-5a5 5 0 015-5zm0-5a3 3 0 100 6 3 3 0 000-6z"/></svg>
        </button>
      </div>

      {/* Pinned */}
      <div
        id="pinnedWrap"
        className={`border-b border-border bg-white/5 px-4 py-2 text-sm ${pinned ? "" : "hidden"}`}
      >
        📌 <span id="pinnedText" className="text-white">Pinned: {pinned || "—"}</span>
      </div>

      {/* Scroll area */}
      <div ref={scrollRef} id="chatScroll" className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6">
        {!group ? (
          <div className="text-center text-textmuted">Select a group to start chatting</div>
        ) : (
          messages.map((m, idx) => (
            <div key={idx} className={`max-w-[78%] ${m.me ? "ml-auto" : ""}`}>
              <div
                className={`${m.me ? "bg-accent text-white" : "bg-white/5 text-white"} rounded-2xl px-3 py-2`}
              >
                <div
                  className="text-sm whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: highlightMentions(m.text),
                  }}
                />
              </div>
              <div className={`mt-1 text-[10px] text-textmuted ${m.me ? "text-right" : ""}`}>
                {m.time}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-border p-3">
        <div className="flex items-end gap-2 bg-white/5 rounded-2xl px-3 py-2">
          {/* Attach */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setAttachOpen((s) => !s);
                setMoreOpen(false);
              }}
              className="p-2 rounded-lg hover:bg-white/10"
              title="Attach"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 6.5L8 15a3 3 0 104.24 4.24l9-9A5.5 5.5 0 008.5 3L3 8.5l1.5 1.5L10 4.5A3.5 3.5 0 1115 9l-9 9a1.5 1.5 0 11-2.12-2.12l8.5-8.5 1.5 1.5-8.5 8.5a3.5 3.5 0 004.95 4.95l9-9A5.5 5.5 0 0016.5 6.5z"/></svg>
            </button>
            <div
              className={`${
                attachOpen ? "" : "hidden"
              } absolute bottom-12 left-0 w-56 bg-card border border-border rounded-xl p-2 menu`}
            >
              <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 00-2 2v16l4-4h6a2 2 0 002-2V4a2 2 0 00-2-2z"/></svg>
                File
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M4 5h16v14H4V5zm8 2l5 4-5 4V7z"/></svg>
                Photo / Video
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.1 2 5 5.1 5 9s7 13 7 13 7-9.1 7-13-3.1-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/></svg>
                Location
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M19 2H5a2 2 0 00-2 2v16l4-4h12a2 2 0 002-2V4a2 2 0 00-2-2z"/></svg>
                Contact
              </button>
            </div>
          </div>

          {/* Expense quick bubble */}
          <button
            onClick={onAddExpense}
            className="p-2 rounded-lg hover:bg-white/10"
            title="Add expense"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M3 5h18v4H3V5zm0 6h10a4 4 0 013.46 2H14a3 3 0 00-2.83 2H3v-4zm0 6h9.17A3 3 0 0014 19h4a4 4 0 01-3.46 2H3v-4zM9 9h3a2 2 0 100-4H9v2h3a1 1 0 010 2H9z"/></svg>
          </button>

          <textarea
            rows={1}
            className="flex-1 bg-transparent outline-none resize-none max-h-32 placeholder:text-textmuted"
            placeholder="Write a message (@mention)…"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (val.trim()) {
                  onSend(val.trim());
                  setVal("");
                }
              }
            }}
          />
          <button
            onClick={() => {
              if (val.trim()) {
                onSend(val.trim());
                setVal("");
              }
            }}
            className="px-4 py-2 bg-accent/90 hover:bg-accent text-white rounded-xl font-medium"
          >
            Send
          </button>
        </div>
        <div className="mt-2">
          <button
            onClick={() => onOpenPoll()}
            className="text-xs bg-white/5 hover:bg-white/10 border border-border rounded-xl px-2.5 py-1.5"
          >
            + Create Poll
          </button>
        </div>
      </div>
    </>
  );
}
