'use client';

import { useEffect, useRef, useState } from 'react';

export default function MoreMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('click', onDoc, true);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('click', onDoc, true);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="p-2 rounded-lg hover:bg-white/10"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        aria-label="More"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white hover:text-orange-500 transition" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="1.5"/>
          <circle cx="12" cy="11" r="1.5"/>
          <circle cx="12" cy="17" r="1.5"/>
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-10 w-48 bg-card border border-border rounded-xl overflow-hidden shadow-soft z-40 menu-anim"
        >
          <button className="w-full px-4 py-2 text-left hover:bg-white/5 text-red-400">Report</button>
          <button className="w-full px-4 py-2 text-left hover:bg-white/5 text-red-400">Unfollow</button>
          <button className="w-full px-4 py-2 text-left hover:bg-white/5">Go to post</button>
          <button className="w-full px-4 py-2 text-left hover:bg-white/5">Share to…</button>
        </div>
      )}
    </div>
  );
}
