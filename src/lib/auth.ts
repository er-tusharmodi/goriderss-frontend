// Token helpers for localStorage model
const ACCESS_KEY = 'gr_accessToken';
const REFRESH_KEY = 'gr_refreshToken';
const USER_KEY = 'gr_user';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_KEY);
}
export function setAccessToken(tok: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_KEY, tok);
}
export function clearAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}
export function isLoggedIn(): boolean {
  return !!getAccessToken();
}
export function getUser<T = any>(): T | null {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(USER_KEY) : null;
    return raw ? JSON.parse(raw) as T : null;
  } catch { return null; }
}
