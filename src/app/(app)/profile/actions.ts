// src/app/(app)/dashboard/profile/actions.ts
'use server';

import { cookies } from 'next/headers';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL_CURRENT_VERSION ||
  process.env.NEXT_PUBLIC_API_BASE ||
  '/api';

type UpOpts = { method?: string; json?: any; headers?: Record<string, string>; cache?: RequestCache };

async function getAT() {
  const jar = await cookies();
  return (
    jar.get('gr_at')?.value ||
    jar.get('accessToken')?.value ||
    jar.get('Authorization')?.value ||
    ''
  );
}

function joinUrl(base: string, path: string) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base.replace(/\/+$/, '')}${p}`;
}

async function upFetch(path: string, opts: UpOpts = {}) {
  const at = await getAT();
  const headers: Record<string, string> = { Accept: 'application/json', ...(opts.headers || {}) };
  if (opts.json !== undefined) headers['Content-Type'] = 'application/json';
  if (at) headers.Authorization = at;

  const res = await fetch(joinUrl(API_BASE, path), {
    method: (opts.method || 'GET').toUpperCase(),
    headers,
    body: opts.json !== undefined ? JSON.stringify(opts.json) : undefined,
    cache: opts.cache ?? 'no-store',
  });

  let data: any = null;
  try { data = await res.json(); } catch {}
  if (!res.ok) throw new Error(String((data && (data.message || data.error)) || `HTTP ${res.status}`));
  return data;
}

/* ===== Types ===== */
export type Trip = {
  _id?: string; id?: string;
  title?: string; tripTitle?: string;
  fromDate: string; toDate: string;
  source: string; destination: string;
  details?: string;
  kilometer?: number;
  bike?: { _id?: string; bikeName?: string; bikeDetails?: string } | string;
  coverImageUrl?: string;
};

export type BikeApi = {
  _id: string;
  bikeName: string;
  bikeDetails?: string;
};

export type BikesList = {
  list: BikeApi[];
  totalBikes?: number;
};

export type MappedProfile = {
  id: string;
  userName: string;
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  bio?: string;
  mobileNumber?: string;
  address?: string;
  dob?: string; // ISO
  sex?: string | null;
  bloodGroup?: string | null;
  instagramLink?: string;
  youtubeLink?: string;
  linkedinLink?: string;

  profileCounts: {
    Trips: number; Posts: number; Followers: number; Following: number; Friends: number;
    totalDistance: number; totalBikes: number; totalRides: number; statesCovered: number; experience: number;
  };

  // Convenience: flat bikes array (for AboutPanel)
  bikes: { name: string; meta?: string; imageUrl?: string }[];

  // Raw-style bikesList as API returned (if you want exact list/count)
  bikesList?: BikesList;

  trips: Trip[];
};

function safeNum(n: any, d = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : d;
}

/* ===== API: GET my profile (maps bikes from the same response) ===== */
export async function getMyProfile(userId?: string): Promise<MappedProfile> {
  const jar = await cookies();

  // try cookie user for id/username fallbacks
  let cookieUser: any = {};
  try { cookieUser = JSON.parse(decodeURIComponent(jar.get('gr_user')?.value || '')); } catch {}

  const id = userId || cookieUser?._id || cookieUser?.id || '';
  if (!id) throw new Error('Missing user id for profile');

  const raw = await upFetch(`/UserProfile/get-user-profile/${id}`, { method: 'GET' });
  const d = raw?.data || {};

  // ----- bikes -----
  const bikesListArray: BikeApi[] = Array.isArray(d?.bikesList?.list) ? d.bikesList.list : [];
  const bikesFlat = bikesListArray.map((b) => ({
    name: b?.bikeName || '—',
    meta: b?.bikeDetails || '',
    imageUrl: '', // keep slot for future image support
  }));

  // ----- trips -----
  const trips: Trip[] = Array.isArray(d?.ridingPortfolio) ? d.ridingPortfolio : [];

  // ----- counts -----
  const c = d?.profileCounts || {};

  const profile: MappedProfile = {
    id: d?._id || id,
    userName: d?.userName || cookieUser?.userName || cookieUser?.username || (d?.fullName || '—'),
    fullName: d?.fullName || '',
    email: d?.email || '',
    avatarUrl: d?.avatarUrl || '/assets/dummyUser.png',
    coverImageUrl: d?.coverImageUrl || '/assets/headerBanner.jpg',
    bio: d?.bio || '',
    mobileNumber: d?.mobileNumber || '',
    address: d?.address || '',
    dob: d?.DOB || '',
    sex: d?.sex ?? null,
    bloodGroup: d?.bloodGroup ?? null,
    instagramLink: d?.instagramLink || '',
    youtubeLink: d?.youtubeLink || '',
    linkedinLink: d?.linkedinLink || '',

    profileCounts: {
      Trips: safeNum(c?.Trips),
      Posts: safeNum(c?.Posts),
      Followers: safeNum(c?.Followers),
      Following: safeNum(c?.Following),
      Friends: safeNum(c?.Friends),
      totalDistance: safeNum(c?.totalDistance),
      totalBikes: safeNum(c?.totalBikes ?? bikesListArray.length),
      totalRides: safeNum(c?.totalRides),
      statesCovered: safeNum(c?.statesCovered),
      experience: safeNum(c?.experience),
    },

    bikes: bikesFlat,
    bikesList: {
      list: bikesListArray,
      totalBikes: safeNum(d?.bikesList?.totalBikes ?? bikesListArray.length),
    },

    trips,
  };

  return profile;
}
