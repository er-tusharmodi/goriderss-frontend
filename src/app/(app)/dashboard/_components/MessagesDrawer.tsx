'use client';

import { useUI } from '../_store/ui.store';

export default function MessagesDrawer() {
  const { messagesOpen, closeMessages } = useUI();

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full sm:w-[420px] bg-slatebg border-l border-border shadow-soft transition-transform duration-200 z-50 ${
        messagesOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Messages Drawer"
    >
      <div className="h-full flex flex-col">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div className="text-lg font-semibold">Messages</div>
          <button
            onClick={closeMessages}
            className="p-2 rounded-lg hover:bg-white/10"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-border">
          {/* Dummy items – later API से भरेंगे */}
          <a href="#" className="flex items-center gap-3 px-4 py-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://i.pravatar.cc/40?img=1" className="h-10 w-10 rounded-full" alt="avatar"/>
            <div className="min-w-0 flex-1">
              <div className="font-medium truncate">Anushka K</div>
              <div className="text-xs text-textmuted truncate">Hey, ride plan for weekend?</div>
            </div>
            <span className="text-xs text-textmuted">2m</span>
          </a>

          <a href="#" className="flex items-center gap-3 px-4 py-3">
            <img src="https://i.pravatar.cc/40?img=2" className="h-10 w-10 rounded-full" alt="avatar"/>
            <div className="min-w-0 flex-1">
              <div className="font-medium truncate">Karan A</div>
              <div className="text-xs text-textmuted truncate">Route shared ✔️</div>
            </div>
            <span className="text-xs text-textmuted">5m</span>
          </a>

          <a href="#" className="flex items-center gap-3 px-4 py-3">
            <img src="https://i.pravatar.cc/40?img=3" className="h-10 w-10 rounded-full" alt="avatar"/>
            <div className="min-w-0 flex-1">
              <div className="font-medium truncate">Rajesh P</div>
              <div className="text-xs text-textmuted truncate">Bro, fuel stop here</div>
            </div>
            <span className="text-xs text-textmuted">12m</span>
          </a>
        </div>
      </div>
    </div>
  );
}
