// app/(app)/dashboard/_components/CreateBox.tsx
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type Noti = { id: string; title: string; subtitle?: string; time: string; read?: boolean };

/* === Small start→destination route glyph (search ke left) === */
function RouteGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3" opacity=".6" />
      <circle cx="12" cy="5" r="3" fill="#fff" />
      <circle cx="12" cy="19" r="3" fill="#F25C2A" />
    </svg>
  );
}

export default function CreateBox() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ---- Search ----
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onSlashFocus = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (e.key === '/' && tag !== 'input' && tag !== 'textarea' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onSlashFocus);
    return () => window.removeEventListener('keydown', onSlashFocus);
  }, []);

  // ---- Notifications ----
  const [notis, setNotis] = useState<Noti[]>([
    { id: 'n1', title: 'Udaipur Weekend Sprint', subtitle: 'Karan: “Meet 6am sharp…”', time: '2m', read: false },
    { id: 'n2', title: 'Expense Updated', subtitle: 'Lunch split finalized', time: '25m', read: false },
    { id: 'n3', title: 'Trip Approved', subtitle: 'Jaipur Monsoon Loop', time: '1h', read: true },
  ]);
  const unread = notis.filter(n => !n.read).length;

  const [openNoti, setOpenNoti] = useState(false);
  const notiBtnRef = useRef<HTMLButtonElement>(null);
  const notiMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!openNoti) return;
      const t = e.target as Node;
      if (notiMenuRef.current?.contains(t) || notiBtnRef.current?.contains(t)) return;
      setOpenNoti(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [openNoti]);

  function markAllRead() {
    setNotis(prev => prev.map(n => ({ ...n, read: true })));
  }

  // ---- Logout ----
  async function onLogout() {
    if (loading) return;
    try {
      setLoading(true);
      await fetch('/api/logout', { cache: 'no-store' });
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="lg:ml-72">
      <div className="sticky top-0 z-30 bg-slatebg/90 backdrop-blur border-b border-border">
        {/* thoda extra space: centered container + wider side padding */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center bg-card border border-border rounded-2xl px-3 sm:px-4 py-2.5 flex-1 focus-within:ring-2 focus-within:ring-accent/40">
            <RouteGlyph className="h-5 w-5 mr-2 sm:mr-3 shrink-0" />
            <input
              ref={searchRef}
              className="bg-transparent w-full outline-none placeholder:text-textmuted"
              placeholder="Search riders, trips, helpers…"
            />
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-textmuted bg-white/5 border border-border rounded-md px-2 py-0.5 whitespace-nowrap">
              Press <kbd className="px-1 rounded bg-white/10">/</kbd> to search
            </span>
          </div>

          {/* Right actions */}
          <div className="relative flex items-center gap-2 sm:gap-3">
            {/* Notifications (unchanged design) */}
            <button
              ref={notiBtnRef}
              title="Notifications"
              aria-label="Notifications"
              onClick={() => setOpenNoti(v => !v)}
              className="relative inline-grid place-items-center h-10 w-10 rounded-xl bg-card border border-border hover:bg-white/5"
            >
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22a2 2 0 002-2H10a2 2 0 002 2zm6-6V11a6 6 0 10-12 0v5L4 18v1h16v-1l-2-2z"/>
              </svg>
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-red-500 text-white text-[10px] font-semibold">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </button>

            {openNoti && (
              <div
                ref={notiMenuRef}
                role="menu"
                aria-label="Notifications"
                className="absolute right-0 top-12 w-[320px] max-w-[92vw] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-40"
              >
                <div className="px-4 py-3 flex items-center justify-between border-b border-border">
                  <div className="font-semibold">Notifications</div>
                  <button onClick={markAllRead} className="text-xs text-textmuted hover:text-white">Mark all read</button>
                </div>

                <ul className="max-h-80 overflow-y-auto no-scrollbar divide-y divide-border">
                  {notis.length === 0 && (
                    <li className="px-4 py-6 text-sm text-textmuted text-center">No notifications</li>
                  )}
                  {notis.map(n => (
                    <li key={n.id} className="px-4 py-3 hover:bg-white/5">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 h-2.5 w-2.5 rounded-full ${n.read ? 'bg-white/20' : 'bg-accent'}`} />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium truncate">{n.title}</div>
                          {n.subtitle && <div className="text-xs text-textmuted truncate">{n.subtitle}</div>}
                        </div>
                        <div className="text-[11px] text-textmuted whitespace-nowrap ml-2">{n.time}</div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-border">
                  <Link
                    href="/notifications"
                    className="block text-center text-sm px-4 py-2.5 hover:bg-white/5"
                    onClick={() => setOpenNoti(false)}
                  >
                    View more
                  </Link>
                </div>
              </div>
            )}

            {/* Logout — thoda right spacing (no negative margin) */}
            <button
              onClick={onLogout}
              title="Log Out"
              aria-label="Log Out"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-card border border-border rounded-xl cursor-pointer h-10 px-3.5 pr-4 hover:bg-white/5"
            >
              {loading ? (
                <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25" />
                  <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 17l5-5-5-5v10zM4 4h8v2H6v12h6v2H4V4z"/>
                </svg>
              )}
              <span className="text-sm font-medium text-white">{loading ? 'Logging out…' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
