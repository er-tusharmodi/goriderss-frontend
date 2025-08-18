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

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans", // maps to Tailwind token
  display: "swap",
});

export const metadata: Metadata = {
  title: "GoRiderss",
  description: "Plan Trips • Connect Riders • Safety First",
};

export default function Layout({ children }: { children: ReactNode }) {
  // server-side guard (क्योंकि session server पर है)
  // if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
  //   redirect('/login?next=/dashboard');
  // }
  // httpOnly/non-httpOnly cookies को server पर पढ़ो
  const { user } = getSessionServer();

  const avatar =
    user?.avatarFileId
      ? `https://api.goriderss.app/api/v1/file/${user.avatarFileId}`
      : 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png';

  return (
    <html lang="en" className={poppins.variable}>
      <body className={`bg-slatebg text-white font-sans`} suppressHydrationWarning> 
          {/* top bar (client component) */}
          <MobileTopbar />
          {/* sidebar (client), user info server से pass कर रहे */}
          <Sidebar
            user={{
              name: user?.fullName || 'Rider',
              role: 'XPulse Rider',
              avatarUrl: avatar,
              status: 'online',
            }}
          />

          {/* overlay को client-side store से खुद state लेनी चाहिए (नीचे छोटा change दिया है) */}
          <DrawerOverlay />
          <TopBar />
          <main className="lg:ml-72 min-h-screen">
            {children}
          </main>
          {/* client-only UI mounts */}
          <MessagesDrawer />
          <Lightbox />
          <CreatePostModal />
          <MessagesFab />
      </body>
    </html>
  );
}
