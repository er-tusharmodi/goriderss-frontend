// app/(app)/dashboard/layout.tsx
import { ReactNode } from 'react';
import Sidebar from './_components/Sidebar';
import MobileTopbar from './_components/MobileTopbar';
import DrawerOverlay from './_components/DrawerOverlay';
import MessagesDrawer from './_components/MessagesDrawer';
import Lightbox from './_components/Lightbox';
import CreatePostModal from './_components/CreatePostModal';
import TopBar from './_components/TopBar';
import MessagesFab from './_components/MessagesFab';
import { getSessionServer } from './_lib/session.server';
import { Poppins } from "next/font/google";
import "@/app/globals.css";
import type { Metadata } from "next";
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GoRiderss",
  description: "Plan Trips • Connect Riders • Safety First",
};

// prevent static optimization (reads cookies)
export const dynamic = 'force-dynamic';

export default async function Layout({ children }: { children: ReactNode }) {
  // ⬇️ must await in Next 14
  const cookieStore = await cookies();
  const at = cookieStore.get('gr_at')?.value;

  if (!at) {
    redirect('/login?next=/dashboard');
  }

  // safe to await even if function returns plain object
  const { user } = await getSessionServer();

  const avatar = user?.avatarFileId
    ? `https://api.goriderss.app/api/v1/file/${user.avatarFileId}`
    : '/assets/dummyUser.png';

  return (
    <html lang="en" className={poppins.variable}>
      <body className="bg-slatebg text-white font-sans" suppressHydrationWarning>
        <MobileTopbar />
        <Sidebar
          user={{
            name: user?.fullName || 'Rider',
            role: 'XPulse Rider',
            avatarUrl: avatar,
            status: 'online',
          }}
        />
        <DrawerOverlay />
        <TopBar />
        <main className="lg:ml-72 min-h-screen">{children}</main>
        <MessagesDrawer />
        <Lightbox />
        <CreatePostModal />
        <MessagesFab />
      </body>
    </html>
  );
}
