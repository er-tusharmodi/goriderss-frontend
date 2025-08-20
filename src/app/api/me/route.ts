// app/api/me/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

type SafeUser = {
  _id?: string;
  fullName?: string;
  userName?: string;
  address?: string;
  avatarFileId?: string;
  avatarUrl?: string; // optional direct URL fallback
};

function parseUserCookie(raw?: string | null): SafeUser | null {
  if (!raw) return null;
  // try URI-encoded JSON
  try { return JSON.parse(decodeURIComponent(raw)); } catch {}
  // try base64 JSON
  try { return JSON.parse(Buffer.from(String(raw), 'base64').toString('utf8')); } catch {}
  // try plain JSON
  try { return JSON.parse(String(raw)); } catch {}
  return null;
}

export async function GET() {
  const c = await cookies();

  // require session
  const at = c.get('gr_at')?.value;
  if (!at) {
    return NextResponse.json({ ok: false, message: 'Unauthenticated' }, { status: 401 });
  }

  const user = parseUserCookie(c.get('gr_user')?.value) || {};
  return NextResponse.json(
    { ok: true, user },
    { status: 200, headers: { 'Cache-Control': 'no-store' } },
  );
}
