'use server';

import { cookies } from 'next/headers';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL_CURRENT_VERSION ??
  process.env.NEXT_PUBLIC_API_BASE ??
  '/api';

function joinUrl(base: string, path: string) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base.replace(/\/+$/, '')}${p}`;
}

async function getAT() {
  const jar = await cookies();
  return (
    jar.get('gr_at')?.value ||
    jar.get('accessToken')?.value ||
    jar.get('Authorization')?.value ||
    ''
  );
}

export async function upFetch(path: string, init: RequestInit = {}) {
  const at = await getAT();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  };
  if (!(init.body instanceof FormData)) {
    // only set when sending json
    if (init.method && init.method !== 'GET') {
      headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    }
  }
  if (at) headers.Authorization = at;

  const res = await fetch(joinUrl(API_BASE, path), {
    ...init,
    headers,
    cache: 'no-store',
  });

  let data: any = null;
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    const err = new Error(String(msg));
    (err as any).details = { status: res.status, url: path };
    throw err;
  }
  return data;
}

/** GET /UserProfile/get-user-profile/:userId */
export async function getUserProfile(userId: string) {
  return upFetch(`/UserProfile/get-user-profile/${userId}`, { method: 'GET' });
}
