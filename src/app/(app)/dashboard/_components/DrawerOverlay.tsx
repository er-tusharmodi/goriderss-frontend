// app/(app)/dashboard/_components/DrawerOverlay.tsx
'use client';
import { useUI } from '../_store/ui.store';

export default function DrawerOverlay() {
  const { sidebarOpen, closeSidebar } = useUI();
  return (
    <div
      className={`fixed inset-0 bg-black/50 z-[60] lg:hidden ${sidebarOpen ? '' : 'hidden'}`}
      onClick={closeSidebar}
    />
  );
}
