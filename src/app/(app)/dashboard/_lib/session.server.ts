import 'server-only';
import { cookies } from 'next/headers';

export type Session = {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
};

// Some Next.js contexts return a Promise from cookies()
// so make this helper async and always await it.
export async function getSessionServer(): Promise<Session> {
  const c = await cookies(); // ✅ await here

  const accessToken  = c.get('gr_at')?.value ?? null;
  const refreshToken = c.get('gr_rt')?.value ?? null;

  let user: any = null;
  const userRaw = c.get('gr_user')?.value;
  if (userRaw) {
    try { user = JSON.parse(userRaw); } catch {}
  }

  return { accessToken, refreshToken, user };
}
