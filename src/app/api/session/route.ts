// app/api/session/route.ts
import { NextResponse } from 'next/server';

type Body = {
  accessToken: string;
  refreshToken: string;
  user?: any;
};

const isProd = process.env.NODE_ENV === 'production';

// 7 days (seconds)
const ACCESS_MAX_AGE = 60 * 60 * 24 * 7;
// 30 days (seconds) – example
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    if (!body?.accessToken || !body?.refreshToken) {
      return NextResponse.json({ success: false, message: 'Missing tokens' }, { status: 400 });
    }

    const res = NextResponse.json({ success: true });

    // HTTP-only auth cookies (middleware/server can read, JS cannot)
    res.cookies.set('gr_at', body.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
      path: '/',
      maxAge: ACCESS_MAX_AGE,
    });

    res.cookies.set('gr_rt', body.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
      path: '/',
      maxAge: REFRESH_MAX_AGE,
    });

    // (Optional) readable cookie for quick UI (non-HttpOnly)
    if (body.user?.fullName) {
      res.cookies.set('gr_name', body.user.fullName, {
        httpOnly: false,
        sameSite: 'lax',
        secure: isProd,
        path: '/',
        maxAge: ACCESS_MAX_AGE,
      });
    }

    // NOTE: If your frontend is on a custom subdomain and you want these
    // cookies to be visible across subdomains, add: domain: '.goriderss.app'
    // Example:
    // res.cookies.set('gr_at', body.accessToken, { ..., domain: '.goriderss.app' })

    return res;
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e?.message || 'Failed' }, { status: 500 });
  }
}
