'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';

export default function UserPublicLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-slatebg text-white min-h-screen">
      {/* Mobile Topbar */}
      <header className="lg:hidden sticky top-0 z-50 bg-slatebg/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="p-2 rounded-lg hover:bg-white/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/></svg>
          </button>
          <Link href="/" className="inline-flex">
            <img
              src="https://ik.imagekit.io/goriderss/Extra/Untitled%20design%20(1).png?updatedAt=1754718803330"
              className="h-10"
              alt="GoRiderss"
            />
          </Link>
          <div className="flex-1" />
          <button className="bg-accent text-white rounded-2xl px-4 py-2.5 font-medium whitespace-nowrap">
            Create Post
          </button>
        </div>
      </header>
      {/* Mobile backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/50 z-[60] ${open ? '' : 'hidden'} lg:hidden`}
      />
      {/* Main content pushed by sidebar */}
      <main className="">{children}</main>
    </div>
  );
}
