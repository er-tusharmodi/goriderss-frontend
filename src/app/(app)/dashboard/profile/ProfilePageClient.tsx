'use client';

import ProfileCoverHeader from './_sections/ProfileCoverHeader';
import ProfileStats from './_sections/ProfileStats';
import TripsSection from './_sections/TripsSection';
import Tabs from './_sections/Tabs';
import AboutPanel from './_sections/AboutPanel';
import PostsPanel from './_sections/PostsPanel';
import GalleryPanel from './_sections/GalleryPanel';

export type ProfileUser = {
  userName: string;
  fullName?: string;
  avatarUrl: string;
  coverUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
};

export default function ProfilePageClient({ user }: { user: ProfileUser }) {
  const {
    userName,
    fullName,
    avatarUrl,
    coverUrl,
    instagramUrl,
    youtubeUrl,
    linkedinUrl,
  } = user;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <section className="bg-card border border-border rounded-2xl overflow-hidden">
        <ProfileCoverHeader
          user={{ userName, fullName, avatarUrl }}
          coverUrl={coverUrl}
          socials={{
            instagram: instagramUrl,
            youtube: youtubeUrl,
            linkedin: linkedinUrl,
          }}
        />
        <ProfileStats />
      </section>

      <section className="bg-card border border-border rounded-2xl">
        <TripsSection />
      </section>

      <section className="bg-card border border-border rounded-2xl">
        <Tabs
          tabs={[
            { id: 'about', label: 'About', content: <AboutPanel /> },
            { id: 'posts', label: 'Posts', content: <PostsPanel /> },
            { id: 'gallery', label: 'Gallery', content: <GalleryPanel /> },
          ]}
          defaultTab="about"
        />
      </section>
    </div>
  );
}
