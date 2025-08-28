'use client';
import Image from 'next/image';
import { useUI } from '../_store/ui.store';

export default function MobileTopbar() {
  const { openSidebar, openCreate } = useUI();
  return (
    <header className="lg:hidden sticky top-0 z-50 bg-slatebg/95 border-b border-border">
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={openSidebar} aria-label="Open menu" className="p-2 rounded-lg hover:bg-white/10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/></svg>
        </button>
        <Image src="https://ik.imagekit.io/goriderss/Extra/Untitled%20design%20(1).png?updatedAt=1754718803330" alt="GoRiderss" width={40} height={40} className="h-10 w-auto"/>
        <div className="flex-1" />
        <button onClick={openCreate} className="bg-accent text-white rounded-2xl px-4 py-2.5 font-medium whitespace-nowrap">
          Create Post
        </button>
      </div>
    </header>
  );
}
