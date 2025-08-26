// src/app/(app)/dashboard/profile/ProfilePageClient.tsx
'use client';

import type { MappedProfile } from './actions';
import ProfileCoverHeader from './_sections/ProfileCoverHeader';
import ProfileStats from './_sections/ProfileStats';
import TripsSection from './_sections/TripsSection';
import Tabs from './_sections/Tabs';
import AboutPanel from './_sections/AboutPanel';
import PostsPanel from './_sections/PostsPanel';
import GalleryPanel from './_sections/GalleryPanel';

export default function ProfilePageClient({ profile }: { profile: MappedProfile }) {
  const {
    fullName,
    userName,
    avatarUrl,
    coverImageUrl,
    bio,
    instagramLink,
    youtubeLink,
    linkedinLink,
    profileCounts,
    trips,
    email,
    mobileNumber,
    address,
    dob,          // kept in case your AboutPanel ever needs it later
    sex,          // kept in case your AboutPanel ever needs it later
    bloodGroup,   // kept in case your AboutPanel ever needs it later
    bikesList,
    bikes,
  } = profile;

  // Prefer the already-mapped flat bikes; otherwise map from bikesList.list
  const bikesForAbout =
    (Array.isArray(bikes) && bikes.length)
      ? bikes
      : (Array.isArray(bikesList?.list)
          ? bikesList!.list.map((b) => ({ name: b.bikeName || '—', meta: b.bikeDetails || '' }))
          : []);

  return (
    <div className="max-w-10xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* ===== Header + Stats ===== */}
      <section className="bg-card border border-border rounded-2xl overflow-hidden">
        <ProfileCoverHeader
          user={{
            userName: userName || '—',
            fullName: fullName || '',
            avatarUrl: avatarUrl || '/assets/dummyUser.png',
          }}
          coverUrl={coverImageUrl}
          socials={{
            instagram: instagramLink || undefined,
            youtube: youtubeLink || undefined,
            linkedin: linkedinLink || undefined,
          }}
          counts={{
            totalDistance: profileCounts?.totalDistance ?? 0,
            experience: profileCounts?.experience ?? 0,
          }}
          meta={{
            location: address || '—',
            riderLabel: bikesList?.list?.[0]?.bikeName
              ? `${bikesList.list[0].bikeName} Rider`
              : undefined,
            bio: bio || '',
          }}
        />

        <ProfileStats
          trips={profileCounts?.Trips ?? 0}
          posts={profileCounts?.Posts ?? 0}
          followers={profileCounts?.Followers ?? 0}
          following={profileCounts?.Following ?? 0}
          friends={profileCounts?.Friends ?? 0}
          totalDistanceKm={profileCounts?.totalDistance ?? 0}
        />
      </section>

      {/* ===== Trips ===== */}
      <section className="bg-card border border-border rounded-2xl">
        <TripsSection
          trips={
            (trips || []).map((trip) => ({
              ...trip,
              bike:
                typeof trip.bike === 'object' && trip.bike !== null
                  ? {
                      ...trip.bike,
                      bikeName: trip.bike.bikeName ?? '—',
                      bikeDetails: trip.bike.bikeDetails ?? '',
                    }
                  : trip.bike
            }))
          }
        />
      </section>

      {/* ===== Tabs ===== */}
      <section className="bg-card border border-border rounded-2xl">
        <Tabs
          tabs={[
            {
              id: 'about',
              label: 'About',
              content: (
                <AboutPanel
                  address={address}
                  experienceYears={profileCounts?.experience ?? 0}
                  username={userName}
                  email={email}
                  mobile={mobileNumber}
                  bikes={bikesForAbout}
                  summary={{
                    completedTrips: profileCounts?.Trips ?? 0,
                    totalDistanceKm: profileCounts?.totalDistance ?? 0,
                    statesCovered: profileCounts?.statesCovered ?? 0,
                  }}
                />
              ),
            },
            { id: 'posts', label: 'Posts', content: <PostsPanel /> },
            { id: 'gallery', label: 'Gallery', content: <GalleryPanel /> },
          ]}
          defaultTab="about"
        />
      </section>
    </div>
  );
}
