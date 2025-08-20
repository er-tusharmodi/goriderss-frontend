import { NextResponse } from 'next/server';

const isProd = process.env.NODE_ENV === 'production';
const ACCESS_MAX_AGE = 60 * 60 * 24 * 7;   // 7d
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30; // 30d

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { accessToken, refreshToken, user } = body || {};

    if (!accessToken || !refreshToken) {
      return NextResponse.json({ success: false, message: 'Missing tokens' }, { status: 400 });
    }

    const res = NextResponse.json({ success: true });

    // cookie names aligned with middleware
    res.cookies.set('gr_at', accessToken, {
      httpOnly: true, sameSite: 'lax', secure: isProd, path: '/', maxAge: ACCESS_MAX_AGE,
    });
    res.cookies.set('gr_rt', refreshToken, {
      httpOnly: true, sameSite: 'lax', secure: isProd, path: '/', maxAge: REFRESH_MAX_AGE,
    });

    // readable (non-HttpOnly) user cookie — JSON encoded
    if (user) {
      res.cookies.set('gr_user', encodeURIComponent(JSON.stringify(user)), {
        httpOnly: false, sameSite: 'lax', secure: isProd, path: '/', maxAge: ACCESS_MAX_AGE,
      });
    }

    return res;
  } catch (e: any) {
    console.error('SESSION_ROUTE_ERR:', e);
    return NextResponse.json({ success: false, message: e?.message || 'Failed' }, { status: 500 });
  }
}
