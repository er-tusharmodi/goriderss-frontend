// src/lib/api.ts

export const API_URL = process.env.NEXT_PUBLIC_API_URL_CURRENT_VERSION;

if (!API_URL) {
  // eslint-disable-next-line no-console
  console.warn('NEXT_PUBLIC_API_URL_CURRENT_VERSION is not defined');
}

type Json = Record<string, any>;

const ACCESS_KEY = 'gr_accessToken';
const REFRESH_KEY = 'gr_refreshToken';
const USER_KEY   = 'gr_user';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_KEY);
}
function clearAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

function timeoutSignal(ms: number) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  return { signal: ctrl.signal, cancel: () => clearTimeout(id) };
}

/**
 * Core request helper
 * - Adds Authorization: Bearer <token> if present
 * - Times out (default 15s)
 * - On 401 -> clears auth (optional: redirect here if you want)
 */
export async function api<T = any>(
  path: string,
  init: RequestInit & { timeoutMs?: number } = {}
): Promise<T> {
  const { timeoutMs = 15000, headers, ...rest } = init;
  const t = timeoutSignal(timeoutMs);

  const url = `${API_URL}${path}`;
  const token = getToken();

  try {
    const res = await fetch(url, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers || {}),
      },
      signal: t.signal,
    });

    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await res.json() : ({} as any);

    if (!res.ok) {
      if (res.status === 401) {
        clearAuth();
        // Optional redirect:
        // if (typeof window !== 'undefined') window.location.replace('/login?session=expired');
      }
      const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
      throw new Error(msg);
    }
    return data as T;
  } finally {
    t.cancel();
  }
}

/** Shorthands */
export const apiGet = <T = any>(path: string, init?: RequestInit) =>
  api<T>(path, { ...init, method: 'GET' });

export const apiPost = <T = any>(
  path: string,
  body?: Json,
  opts?: RequestInit & { timeoutMs?: number }
) =>
  api<T>(path, {
    ...opts,
    method: 'POST',
    body: JSON.stringify(body || {}),
  });
