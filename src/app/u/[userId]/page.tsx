import type { Metadata } from 'next';
import { getUserProfile } from './actions';
import ProfileHeader from './_sections/ProfileHeader';
import TripsSection from './_sections/TripsSection';
import AboutSection from './_sections/AboutSection';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Profile — GoRiderss',
};

type ApiTrip = {
  _id?: string;
  fromDate: string;
  toDate: string;
  source: string;
  destination: string;
  kilometer?: number;
  details?: string;
  coverImageUrl?: string;
  bike?: { _id?: string; bikeName?: string };
};

export default async function UserProfilePage({
  params: { userId },
}: {
  params: { userId: string };
}) {
  // safe fetch (graceful fallback)
  let data: any = {};
  try {
    const r = await getUserProfile(userId);
    data = r?.data ?? {};
  } catch {
    data = {};
  }

  // normalize user fields with fallbacks
  const user = {
    _id: data._id || userId,
    fullName: data.fullName || 'Rider',
    userName: data.userName || 'rider.username',
    email: data.email || '',
    mobileNumber: data.mobileNumber || '',
    bio: data.bio || 'Two wheels, one love. Exploring new routes and sharing stories!',
    avatarUrl:
      data.avatarUrl ||
      '/assets/dummyUser.png',
    coverImageUrl:
      data.coverImageUrl ||
      '/assets/dummyUser.png',
    location: data.address || '—',
    DOB: data.DOB || data.dob || '',
    sex: data.sex || '',
    bloodGroup: data.bloodGroup || '',
    instagramLink: data.instagramLink || '',
    youtubeLink: data.youtubeLink || '',
    linkedinLink: data.linkedinLink || '',
    // ridingPortfolio from API (may be empty)
    ridingPortfolio: Array.isArray(data.ridingPortfolio)
      ? (data.ridingPortfolio as ApiTrip[])
      : ([] as ApiTrip[]),
  };

  return (
    <main className="min-h-screen">
      {/* optional slim topbar (no sidebar) */}
      <div className="sticky top-0 z-20 bg-slatebg/90 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <img src="/logo.svg" alt="" className="h-7 w-auto" />
          <div className="flex-1" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <ProfileHeader user={user} />
        <TripsSection trips={user.ridingPortfolio} />
        <AboutSection user={user} />
      </div>
    </main>
  );
}
