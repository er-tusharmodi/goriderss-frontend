// app/(app)/dashboard/_components/MessagesFab.tsx
'use client';

import { useEffect, useState } from 'react';

export default function MessagesFab() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      {/* FAB */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          fixed right-5 bottom-5 z-[70]
          bg-card border border-border
          px-4 py-3 rounded-full shadow-soft
          flex items-center gap-2 hover:bg-white/5
          cursor-pointer
        "
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 6H3v12h4v4l6-4h8z"/>
        </svg>
        <span>Messages</span>
        <span className="inline-flex items-center justify-center text-xs bg-red-500 text-white h-5 min-w-[1.25rem] rounded-full px-1">1</span>
      </button>

      {/* Overlay + Panel */}
      <div
        className={`
          fixed inset-0 z-[80]
          ${open ? 'pointer-events-auto' : 'pointer-events-none'}
        `}
      >
        {/* Backdrop */}
        <div
          className={`
            absolute inset-0 bg-black/50
            transition-opacity duration-200
            ${open ? 'opacity-100' : 'opacity-0'}
          `}
          onClick={() => setOpen(false)}
        />

        {/* Drawer */}
        <aside
          className={`
            absolute right-0 inset-y-0 w-full sm:w-[420px]
            bg-slatebg border-l border-border shadow-soft
            transform transition-transform duration-300
            ${open ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="h-full flex flex-col">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="text-lg font-semibold">Messages</div>
              <button
                className="p-2 rounded-lg hover:bg-white/10 cursor-pointer"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-border">
              {/* sample row */}
              <a href="#" className="flex items-center gap-3 px-4 py-3">
                <img src="https://i.pravatar.cc/40?img=1" className="h-10 w-10 rounded-full" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">Anushka K</div>
                  <div className="text-xs text-textmuted truncate">Hey, ride plan for weekend?</div>
                </div>
                <span className="text-xs text-textmuted">2m</span>
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
