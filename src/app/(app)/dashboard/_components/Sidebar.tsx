'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
// import { clearAuthCookie } from '@/utils/auth-client';

type NavItem = { label: string; href: string };
type Section = { heading?: string; items: NavItem[] };

type SidebarProps = {
  brandImg?: string;
  brandAlt?: string;
  user?: { name?: string; role?: string; avatarUrl?: string; status?: 'online'|'offline' };
  onCreateTrip?: () => void;
  rewards?: { trips?: number; liveText?: string };
};
const MAIN_SECTIONS: Section[] = [
  {
    heading: 'Main',
    items: [{ label: 'Dashboard', href: '/dashboard' }],
  },
  {
    heading: 'Trips',
    items: [
      { label: 'Trips', href: '/dashboard/trips' },
      { label: 'My Trips', href: '/dashboard/trips/mine' },
      { label: 'Joined Trips', href: '/dashboard/trips/joined' },
      { label: 'Route Planner', href: '/dashboard/route-planner' },
    ],
  },
  {
    heading: 'Community',
    items: [
      { label: 'Rider Feed', href: '/dashboard/feed' },
      { label: 'Groups', href: '/dashboard/groups' },
      { label: 'Helpers', href: '/dashboard/helpers' },
      { label: 'Expenses', href: '/dashboard/expenses' },
      { label: 'Safety & SOS', href: '/dashboard/sos' },
    ],
  },
];

export default function Sidebar({
  brandImg = 'https://ik.imagekit.io/goriderss/Extra/Untitled%20design%20(1).png?updatedAt=1754718803330',
  brandAlt = 'GoRiderss',
  user = { name: 'TuSharthi', role: 'XPulse Rider', avatarUrl: 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png', status: 'online' },
  onCreateTrip,
  rewards = { trips: 15, liveText: 'Live: On Trip' },
}: SidebarProps) {
  const onLogout = async () => {
     try {
      await fetch('/api/logout', { cache: 'no-store' });
    } catch {}
    // optional: localStorage clean if you kept copies
    localStorage.removeItem('gr_accessToken');
    localStorage.removeItem('gr_refreshToken');
    localStorage.removeItem('gr_user');
    console.log(document.cookie);
    //router.replace('/login');
  };
  const router = useRouter();
  
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // close on route change (mobile)
  useEffect(() => { setOpen(false); }, [pathname]);

  // helper: is active link
  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname?.startsWith(href + ''));

  return (
    <>
      {/* Mobile topbar */}
      <div className="lg:hidden sticky top-0 z-[80] border-b border-border bg-black/50 backdrop-blur">
        <div className="px-4 py-3 flex items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg hover:bg-white/10"
            aria-label="Open"
          >
            {/* menu icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z"/>
            </svg>
          </button>
          <div className="ml-1 flex items-center gap-2">
            {/* small brand */}
            <Image src={brandImg} alt={brandAlt} width={36} height={36} className="h-9 w-auto" />
            <span className="text-sm text-white/80">{brandAlt}</span>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside
        id="sidebar"
        className="fixed left-0 top-0 h-screen w-72 bg-slatebg border-r border-border overflow-y-auto no-scrollbar z-[70] transition-transform -translate-x-full lg:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="p-4 flex items-center gap-2">
          <Image src={brandImg} alt={brandAlt} width={160} height={76} className="h-[76px] w-auto" />
          <button
            onClick={() => setOpen(false)}
            className="ml-auto lg:hidden p-2 rounded-lg hover:bg-white/10"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.225 4.811 4.811 6.225 10.586 12l-5.775 5.775 1.414 1.414L12 13.414l5.775 5.775 1.414-1.414L13.414 12l5.775-5.775-1.414-1.414L12 10.586 6.225 4.811z"/>
            </svg>
          </button>
        </div>

        {/* Profile card */}
        <div className="px-4">
          <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={user.avatarUrl || ''} alt="avatar" className="h-10 w-10 rounded-full" />
            <div className="min-w-0">
              <div className="font-semibold truncate">{user.name || 'Rider'}</div>
              <div className="text-xs text-textmuted truncate">{user.role || 'Member'}</div>
            </div>
            <span className={`ml-auto h-2.5 w-2.5 rounded-full ${user.status === 'online' ? 'bg-green-500' : 'bg-white/30'}`} />
          </div>
        </div>

        {/* Nav */}
        <nav className="mt-5 px-2 space-y-4 pb-6">
          {MAIN_SECTIONS.map((sec) => (
            <div key={sec.heading || 'section'}>
              {sec.heading && (
                <div className="px-2 text-xs uppercase tracking-wider text-textmuted mb-2">
                  {sec.heading}
                </div>
              )}
              {sec.items.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition
                    ${isActive(it.href) ? 'bg-white/10 text-white' : 'text-white'}
                  `}
                >
                  {/* kept minimal icons – replace per-route if needed */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 6h16v2H4zM4 11h16v2H4zM4 16h10v2H4z" />
                  </svg>
                  <span className="font-medium">{it.label}</span>
                </Link>
              ))}
            </div>
          ))}

          {/* Rewards + actions */}
          <div className="px-2">
            <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                  <span className="font-medium">Rewards</span>
                </div>
                <span className="text-xs bg-white/10 rounded-full px-2.5 py-0.5">
                  {rewards.trips ?? 0} Trips
                </span>
              </div>
              <div className="flex items-center text-sm text-textmuted gap-2">
                <span className="inline-block h-2.5 w-2.5 bg-green-500 rounded-full"></span>
                <span>{rewards.liveText || 'Live'}</span>
              </div>
            </div>

            <button
              onClick={onCreateTrip}
              className="mt-3 w-full bg-accent text-white font-semibold rounded-2xl py-3 whitespace-nowrap"
            >
              + Create Trip
            </button>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <Link href="/dashboard/settings" className="text-center bg-card border border-border rounded-xl py-2.5">
                Settings
              </Link>
              <button
                onClick={onLogout}
                className="bg-card border border-border rounded-xl py-2.5"
              >
                Log Out
              </button>
            </div>
          </div>
        </nav>
      </aside>

      {/* Mobile drawer layer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-[75]">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-slatebg border-r border-border overflow-y-auto no-scrollbar">
            {/* reuse the same sidebar markup by cloning via CSS translate */}
            {/* simplest: just render the same aside but force translate-x-0 via utility */}
            {/* For brevity, we reuse the main aside already translated-in (above) */}
          </div>
        </div>
      )}
    </>
  );
}
