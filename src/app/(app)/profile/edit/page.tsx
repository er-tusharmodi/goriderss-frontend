// src/app/(app)/dashboard/profile/edit/page.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import EditProfileAllInOneClient from './EditProfileAllInOneClient';
import { getUserFullDetails, listBikesAction, listTripsAction } from './actions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/** Backend origin निकालो: http://localhost:5000/api/v1 -> http://localhost:5000 */
function getBackendOrigin() {
  const full = process.env.NEXT_PUBLIC_API_URL_CURRENT_VERSION || '';
  if (!full) return '';
  // origin = base without trailing /api or /api/vX
  const noTrail = full.replace(/\/+$/, '');
  return noTrail.replace(/\/api(?:\/v\d+)?$/i, '');
}

/** Absolute URL बना दो (relative आए तो backend origin जोड़ें) */
function absUrl(u?: string): string {
  if (!u) return '';
  if (/^https?:\/\//i.test(u)) return u;
  const origin = getBackendOrigin();
  if (!origin) return u; // fallback: जो आया वही ट्राय करो
  return `${origin.replace(/\/$/, '')}/${u.replace(/^\/+/, '')}`;
}

/** Array normalize */
function toArray<T = any>(v: any): T[] {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (Array.isArray(v?.data)) return v.data;
  if (Array.isArray(v?.items)) return v.items;
  return [];
}

/** user object निकालो (common shapes handle) */
function pickUserObject(res: any) {
  const root = res?.data ?? res ?? {};
  return root.user ?? root.profile ?? root;
}

/** possible keys से URL pick */
function pickFromKeys<T = any>(obj: any, keys: string[], def: T = '' as any): T {
  for (const k of keys) {
    if (obj && obj[k] != null && obj[k] !== '') return obj[k] as T;
  }
  return def;
}

export default async function Page() {
  const jar = await cookies();
  const at =
    jar.get('gr_at')?.value ||
    jar.get('accessToken')?.value ||
    jar.get('Authorization')?.value;

  if (!at) redirect('/login?next=/dashboard/profile/edit');

  const [userRes, bikesRes, tripsRes] = await Promise.all([
    getUserFullDetails().catch(() => null),
    listBikesAction().catch(() => null),
    listTripsAction().catch(() => null),
  ]);

  const u = pickUserObject(userRes);

  // common key variants handle + absolute URL ensure
  const rawAvatar = pickFromKeys<string>(u, ['avatarUrl', 'avatar', 'avatarImage', 'profilePic'], '');
  const rawCover  = pickFromKeys<string>(u, ['coverImageUrl', 'cover', 'coverImage', 'coverPic', 'banner'], '');

  const user = {
    userName: u.userName || '',
    fullName: u.fullName || '',
    bio: u.bio || '',
    emailDisplay: !!u.emailDisplay,
    mobileNumberDisplay: !!u.mobileNumberDisplay,
    dob: u.dob || '',
    sex: u.sex || '',
    bloodGroup: u.bloodGroup || '',
    healthHistory: u.healthHistory || '',
    address: u.address || '',
    instagramLink: u.instagramLink || '',
    youtubeLink: u.youtubeLink || '',
    linkedinLink: u.linkedinLink || '',
    email: u.email || '',
    mobileNumber: u.mobileNumber || '',
    avatarUrl: absUrl(rawAvatar),
    coverImageUrl: absUrl(rawCover),
  };

  const bikes = toArray(bikesRes?.data ?? bikesRes);
  const trips = toArray(tripsRes?.data ?? tripsRes);

  return <EditProfileAllInOneClient user={user} bikes={bikes} trips={trips} />;
}
