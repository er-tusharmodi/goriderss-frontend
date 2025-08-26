'use server';

import { cookies } from 'next/headers';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL_CURRENT_VERSION ||
  process.env.NEXT_PUBLIC_API_BASE ||
  '/api'; // dev proxy fallback

async function getAT() {
  const jar = await cookies();
  return (
    jar.get('gr_at')?.value ||
    jar.get('accessToken')?.value ||
    jar.get('Authorization')?.value ||
    ''
  );
}

type UpOpts = {
  method?: string;
  json?: any;
  formData?: FormData;
  headers?: Record<string, string>;
  cache?: RequestCache;
};

function joinUrl(base: string, path: string) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base.replace(/\/+$/, '')}${p}`;
}

async function upFetch(path: string, opts: UpOpts = {}) {
  const at = await getAT();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(opts.headers || {}),
  };
  if (opts.json !== undefined) headers['Content-Type'] = 'application/json';
  if (at) headers.Authorization = at;

  const url = joinUrl(API_BASE, path);
  const method = (opts.method || 'GET').toUpperCase();
  const body =
    opts.json !== undefined ? JSON.stringify(opts.json) : opts.formData ?? undefined;

  const res = await fetch(url, {
    method,
    headers,
    body,
    cache: opts.cache ?? 'no-store',
  });

  let data: any = null;
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    // keep backend message; normalize "All fields are required"
    const raw = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    const msg =
      /all fields are required/i.test(String(raw)) ? 'All fields are required' : String(raw);
    const err = new Error(msg);
    (err as any).details = {
      status: res.status,
      method,
      url,
      bodyType: opts.json ? 'json' : (opts.formData ? 'form' : 'none'),
    };
    throw err;
  }
  return data;
}

/* ---------- helpers to normalize server responses ---------- */
export type Bike = { _id?: string; id?: string; bikeName: string; bikeDetails?: string };
export type Trip = {
  _id?: string; id?: string;
  title?: string;
  fromDate: string; toDate: string;
  source: string; destination: string;
  details?: string; bike?: string | Bike; kilometer?: number;
  coverImageUrl?: string; // optional, list UI में इस्तेमाल
};

function pickArray<T = any>(v: any): T[] {
  if (Array.isArray(v)) return v;
  if (Array.isArray(v?.data)) return v.data;
  if (Array.isArray(v?.items)) return v.items;

  // common custom keys
  if (Array.isArray(v?.trips)) return v.trips;
  if (Array.isArray(v?.data?.trips)) return v.data.trips;
  if (Array.isArray(v?.ridingPortfolio)) return v.ridingPortfolio;
  if (Array.isArray(v?.ridingPortfolioList)) return v.ridingPortfolioList;
  if (Array.isArray(v?.data?.ridingPortfolio)) return v.data.ridingPortfolio;
  if (Array.isArray(v?.data?.ridingPortfolioList)) return v.data.ridingPortfolioList;

  return [];
}

/* ===================== USER ===================== */

export async function getUserFullDetails() {
  // server returns { success, message, data: { ...user } }
  return upFetch('/userProfile/get-single-user-details', { method: 'GET' });
}

export async function updateUserAction(payload: {
  fullName?: string;
  emailDisplay?: boolean;
  mobileNumberDisplay?: boolean;
  dob?: string;
  sex?: string;
  bloodGroup?: string;
  instagramLink?: string;
  youtubeLink?: string;
  linkedinLink?: string;
  healthHistory?: string;
  address?: string;
  bio?: string;
}) {
  // strictly PATCH
  return upFetch('/userProfile/update-user-profile', {
    method: 'PATCH',
    json: payload,
  });
}

/* ===================== AVATAR / COVER ===================== */

export async function updateAvatarAction(fd: FormData) {
  try {
    return await upFetch('/userProfile/update-avatar', { method: 'PATCH', formData: fd });
  } catch {
    return upFetch('/userProfile/update-avatar', { method: 'POST', formData: fd });
  }
}

export async function updateCoverAction(fd: FormData) {
  try {
    return await upFetch('/userProfile/update-cover', { method: 'PATCH', formData: fd });
  } catch {
    return upFetch('/userProfile/update-cover', { method: 'POST', formData: fd });
  }
}

/* ===================== EMAIL CHANGE + OTP ===================== */

export async function requestChangeEmailAction(email: string) {
  return upFetch('/userProfile/change-user-email', { method: 'POST', json: { email } });
}

export async function verifyChangeEmailOtpAction(email: string, otp: string | number) {
  const otpNum = typeof otp === 'string' ? Number(otp) : otp;
  return upFetch('/userProfile/change-user-email', { method: 'POST', json: { email, otp: otpNum } });
}

/* ========= BIKES ========= */

// bikes list normalize → हमेशा { data: Bike[] }
function extractBikes(v: any): Bike[] {
  const ok = (x: any) =>
    Array.isArray(x) &&
    x.length > 0 &&
    typeof x[0] === 'object' &&
    (x[0].bikeName !== undefined || x[0].bikeDetails !== undefined || x[0]._id || x[0].id);

  const cands =
    (ok(v) && v) ||
    (ok(v?.data) && v?.data) ||
    (ok(v?.items) && v?.items) ||
    (ok(v?.bikes) && v?.bikes) ||
    (ok(v?.data?.bikes) && v?.data?.bikes) ||
    (ok(v?.data?.items) && v?.data?.items) ||
    (ok(v?.data?.bikeList) && v?.data?.bikeList) ||
    (ok(v?.bikeList) && v?.bikeList);

  if (cands) return cands as Bike[];

  // deep scan (last resort)
  const q: any[] = [v];
  while (q.length) {
    const cur = q.shift();
    if (!cur || typeof cur !== 'object') continue;
    for (const k of Object.keys(cur)) {
      const val = (cur as any)[k];
      if (ok(val)) return val as Bike[];
      if (val && typeof val === 'object') q.push(val);
    }
  }
  return [];
}

export async function listBikesAction() {
  const raw = await upFetch('/userProfile/bikes-list', { method: 'GET' });
  const list = extractBikes(raw?.data ?? raw);
  return { ...raw, data: list };
}

export async function addBikeAction(bikeName: string, bikeDetails: string) {
  return upFetch('/userProfile/add-bike', {
    method: 'POST',
    json: { bikeName, bikeDetails },
  });
}

export async function deleteBikeAction(id: string) {
  return upFetch(`/userProfile/delete-bike/${id}`, { method: 'DELETE' });
}

/* ===================== TRIPS (Riding Portfolio) ===================== */

export async function listTripsAction() {
  const raw = await upFetch('/userProfile/riding-portfolio-list', { method: 'GET' });
  const list = pickArray<Trip>(raw?.data ?? raw);
  return { ...raw, data: list };
}

export async function addTripAction(payload: {
  title?: string;
  fromDate: string;
  toDate: string;
  source: string;
  destination: string;
  details?: string;
  bike: string;
  kilometer?: number;
}) {
  return upFetch('/userProfile/add-riding-portfolio', { method: 'POST', json: payload });
}

export async function editTripAction(
  id: string,
  payload: {
    title?: string;
    fromDate: string;
    toDate: string;
    source: string;
    destination: string;
    details?: string;
    bike: string;
    kilometer?: number;
  }
) {
  return upFetch(`/userProfile/edit-riding-portfolio/${id}`, {
    method: 'PATCH',
    json: payload,
  });
}

export async function deleteTripAction(id: string) {
  return upFetch(`/userProfile/delete-riding-portfolio/${id}`, { method: 'DELETE' });
}

/* ===================== PUBLIC USER PROFILE (VIEW) ===================== */

/**
 * Get public profile by userId
 * Endpoint: /UserProfile/get-user-profile/:userId  (GET)
 * - Authorization cookie हो तो साथ भेज दी जाती है (public हो तो भी कोई दिक्कत नहीं)
 * - raw server response लौटाता है { statusCode, message, success, data: {...} }
 */
export async function getUserProfileById(userId: string) {
  if (!userId) throw new Error('userId is required');
  return upFetch(`/UserProfile/get-user-profile/${encodeURIComponent(userId)}`, {
    method: 'GET',
  });
}