// app/(app)/dashboard/_components/Sidebar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUI } from '../_store/ui.store';

type NavItem = { label: string; href: string };
type Section = { heading?: string; items: NavItem[] };

const MAIN_SECTIONS: Section[] = [
  { heading: 'Main', items: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Profile', href: '/profile' },
    { label: 'Insights', href: '/insights' },
    { label: 'Settings', href: '/settings' },
  ]},
  { heading: 'Trips', items: [
    { label: 'Trips', href: '/trips' },
    { label: 'Explore Trips', href: '/explore-trips' },
    { label: 'Route Planner', href: '/route-planner' },
  ]},
  { heading: 'Community', items: [
    { label: 'Groups', href: '/groups' },
    { label: 'Expenses', href: '/expenses' },
  ]},
];

const FILE_BASE = 'https://api.goriderss.app/api/v1/file/';
const DEFAULT_AVATAR = '/assets/dummyUser.png';

/* ---------- Icons mapped to titles ---------- */
function Icon({ name, className = 'h-5 w-5 text-white' }: { name: string; className?: string }) {
  switch (name) {
    case 'Dashboard': // home
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3l9 8h-3v9H6v-9H3l9-8z" />
        </svg>
      );
    case 'Setting': // user
        return (
          <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
            <path d="M19.4 12.9c.06-.3.1-.61.1-.9s-.04-.6-.1-.9l2-1.5-2-3.4-2.3.9c-.48-.36-1.02-.66-1.6-.9L15 2H9l-.5 2.2c-.58.24-1.12.54-1.6.9l-2.3-.9-2 3.4 2 1.5c-.06.3-.1.61-.1.9s.04.6.1.9l-2 1.5 2 3.4 2.3-.9c.48.36 1.02.66 1.6.9L9 22h6l.5-2.2c.58-.24 1.12-.54 1.6-.9l2.3.9 2-3.4-2-1.5ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z" />
          </svg>
        );
    case 'Insights': {
        return (
          <svg
            viewBox="0 0 24 24"
            className={className}
            aria-hidden="true"
          >
            {/* bars */}
            <rect x="3" y="12" width="4" height="8" rx="1.2" fill="currentColor" />
            <rect x="10" y="8"  width="4" height="12" rx="1.2" fill="currentColor" />
            <rect x="17" y="4"  width="4" height="16" rx="1.2" fill="currentColor" />

            {/* baseline */}
            <path d="M3 20.5H21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />

            {/* trend line */}
            <path
              d="M4 15l4-4 3 3 5-6 4 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
    }
    case 'Profile': // user
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12a5 5 0 100-10 5 5 0 000 10zM2 22a10 10 0 0120 0H2z" />
        </svg>
      );
    case 'Trips': // list/checklist
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 6h12v2H4zM4 10h12v2H4zM4 14h8v2H4zM19 5l-3 3-1-1 4-4 4 4-1 1-3-3z" />
        </svg>
      );
    case 'Explore Trips': // compass
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm3.5 6.5l-2.1 5.1-5.1 2.1 2.1-5.1 5.1-2.1z" />
        </svg>
      );
    case 'Route Planner': // route/waypoints
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 6a3 3 0 116 0c0 1.66-3 6-3 6S6 7.66 6 6zm9 12a3 3 0 116 0c0 1.66-3 6-3 6s-3-4.34-3-6zM6 12h6a3 3 0 013 3v3h2v-3a5 5 0 00-5-5H6v2z" />
        </svg>
      );
    case 'Rider Feed': // newspaper
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 4h14a2 2 0 012 2v12a2 2 0 01-2 2H6a4 4 0 01-4-4V6a2 2 0 012-2zm0 2v10a2 2 0 002 2h12V6H4zm2 2h8v2H6V8zm0 4h8v2H6v-2z" />
        </svg>
      );
    case 'Groups': // users
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 11a4 4 0 10-8 0 4 4 0 008 0zm-7 5a7 7 0 0110 0v2H9v-2zm-2.5-9a2.5 2.5 0 110-5 2.5 2.5 0 010 5zM2 17a5 5 0 017-4.58A6.97 6.97 0 006 19H2v-2z" />
        </svg>
      );
    case 'Helpers': // lifesaver
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm5 10a5 5 0 11-10 0 5 5 0 0110 0zm-9.54 5.46L9 15a7 7 0 006 0l1.54 2.46A8 8 0 017.46 17.46zM9 9L7.46 6.54A8 8 0 0116.54 6.54L15 9a7 7 0 00-6 0z" />
        </svg>
      );
    case 'Expenses': // receipt + ₹
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 2h12a1 1 0 011 1v18l-3-2-3 2-3-2-3 2-3-2V3a1 1 0 011-1zm5 6h2a3 3 0 110 6h-1v2h-2v-2H8v-2h4a1 1 0 100-2h-2V8h2z"/>
        </svg>
      );
    case 'Safety & SOS': // shield alert
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l8 3v6c0 5-3.6 9.7-8 10-4.4-.3-8-5-8-10V5l8-3zm-1 5h2v6h-2V7zm1 10a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 6h16v2H4zM4 11h16v2H4zM4 16h10v2H4z" />
        </svg>
      );
  }
}

export default function Sidebar({
  brandImg = '/assets/primaryLogo.png',            // ✅ same prop, बस size/centering बदला है
  brandAlt = 'GoRiderss',
  user = { name: 'Rider', role: 'Member', avatarUrl: DEFAULT_AVATAR, status: 'online' as const },
  rewards = { trips: 15, liveText: 'Live: On Trip' },
}: {
  brandImg?: string;
  brandAlt?: string;
  user?: { name?: string; role?: string; avatarUrl?: string; status?: 'online'|'offline' };
  rewards?: { trips?: number; liveText?: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { sidebarOpen, closeSidebar, sidebarCompact } = useUI();

  // close mobile drawer on route change
  useEffect(() => { closeSidebar(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [pathname]);

  // hydrate profile from /api/me (optional)
  const [me, setMe] = useState<{ userName?: string; fullName?: string; avatarUrl?: string } | null>(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/me', { cache: 'no-store' });
        if (!res.ok) return;
        const j = await res.json();
        if (!alive || !j?.ok) return;
        const avatarUrl = j.user?.avatarFileId ? `${FILE_BASE}${j.user.avatarFileId}` : j.user?.avatarUrl || undefined;
        setMe({ fullName: j.user?.fullName, userName: j.user?.userName, avatarUrl });
      } catch {}
    })();
    return () => { alive = false; };
  }, []);

  const onLogout = async () => { try { await fetch('/api/logout', { cache: 'no-store' }); } catch {} router.replace('/login'); };

  const isActive = (href: string) => pathname === href || (href !== '/dashboard' && pathname?.startsWith(href));
  const isCompact = sidebarCompact;
  const widthCls = isCompact ? 'lg:w-16' : 'lg:w-72';

  const displayName = me?.userName || user.name;
  const displayAddress = me?.fullName || user.role;
  const displayAvatar = me?.avatarUrl || user.avatarUrl || DEFAULT_AVATAR;

  return (
    <>
      {/* Mobile drawer backdrop */}
      <button
        aria-label="Close sidebar"
        onClick={closeSidebar}
        className={`fixed inset-0 z-[65] bg-black/60 ${sidebarOpen ? '' : 'hidden'} lg:hidden`}
      />

      {/* Panel */}
      <aside
        id="sidebar"
        aria-label="Sidebar"
        className={[
          'fixed left-0 top-0 h-screen bg-slatebg border-r border-border overflow-y-auto no-scrollbar z-[70]',
          'w-72',                // mobile drawer width
          widthCls,              // desktop width
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
          'transition-all duration-200 ease-out',
        ].join(' ')}
      >
        {/* Brand — UPDATED: bigger + centered */}
        <div className={isCompact ? 'p-3 grid place-items-center' : 'grid place-items-center'}>
          {isCompact ? (
            <Image
              src={brandImg}
              alt={brandAlt}
              width={48}
              height={48}
              className="h-12 w-auto"
              priority
            />
          ) : (
            <Image
              src={brandImg}
              alt={brandAlt}
              width={320}
              height={96}
              className="h-[92px] w-auto"
              priority
            />
          )}
        </div>

        {/* Profile — compact: avatar centered, round, ring */}
        <div className="px-4">
          <div className={`bg-card border border-border rounded-2xl ${isCompact ? 'p-3 grid place-items-center' : 'p-4 flex items-center gap-3'}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayAvatar}
              alt="avatar"
              className={`${isCompact ? 'h-11 w-11' : 'h-10 w-10'} rounded-full object-cover ring-2 ring-white/10`}
            />
            {!isCompact && (
              <div className="min-w-0">
                <div className="font-semibold truncate">{displayName}</div>
                <div className="text-xs text-textmuted truncate">{displayAddress}</div>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="mt-5 px-2 space-y-4 pb-6">
          {MAIN_SECTIONS.map((sec) => (
            <div key={sec.heading || 'section'}>
              {!isCompact && sec.heading && (
                <div className="px-2 text-xs uppercase tracking-wider text-textmuted mb-2">{sec.heading}</div>
              )}
              {sec.items.map((it) => {
                const active = isActive(it.href);
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    title={it.label}                  // hover title
                    aria-label={it.label}
                    className={[
                      'group flex items-center gap-3 px-3 py-2 rounded-lg transition',
                      active ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-white',
                      isCompact ? 'justify-center' : '',
                    ].join(' ')}
                  >
                    <Icon name={it.label} className={`h-5 w-5 ${active ? 'text-white' : 'text-white'}`} />
                    {!isCompact && <span className="font-medium truncate">{it.label}</span>}
                    {isCompact && <span className="sr-only">{it.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}

          {/* Rewards + actions */}
          <div className="px-2">
            {isCompact ? (
              <div className="flex flex-col items-center gap-3">
                <Link
                  href="/trips/create"
                  title="Create Trip"
                  aria-label="Create Trip"
                  className="w-10 h-10 grid place-items-center bg-accent text-white rounded-xl"
                >
                  +
                </Link>
                <Link
                  href="/dashboard/settings"
                  title="Settings"
                  aria-label="Settings"
                  className="w-10 h-10 grid place-items-center bg-card border border-border rounded-xl"
                >
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8a4 4 0 100 8 4 4 0 000-8zM2 13h2a8 8 0 0016 0h2v-2h-2a8 8 0 00-16 0H2v2z"/></svg>
                </Link>
                <button
                  onClick={onLogout}
                  title="Log Out"
                  aria-label="Log Out"
                  className="w-10 h-10 grid place-items-center bg-card border border-border rounded-xl cursor-pointer"
                >
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M10 17l5-5-5-5v10zM4 4h8v2H6v12h6v2H4V4z"/></svg>
                </button>
              </div>
            ) : (
              <>
                <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                      <span className="font-medium">Rewards</span>
                    </div>
                    <span className="text-xs bg-white/10 rounded-full px-2.5 py-0.5">{rewards.trips ?? 0} Trips</span>
                  </div>
                  <div className="flex items-center text-sm text-textmuted gap-2">
                    <span className="inline-block h-2.5 w-2.5 bg-green-500 rounded-full"></span>
                    <span>{rewards.liveText || 'Live'}</span>
                  </div>
                </div>

                <Link
                  href="/trips/create"
                  className="mt-3 w-full bg-accent text-white font-semibold rounded-2xl py-3 whitespace-nowrap inline-flex items-center justify-center"
                >
                  + Create Trip
                </Link>
              </>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}
