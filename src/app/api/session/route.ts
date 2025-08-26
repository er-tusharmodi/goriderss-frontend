// app/api/session/route.ts
import { NextResponse } from 'next/server';

const isProd = process.env.NODE_ENV === 'production';
const cookieBase = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: isProd,
  path: '/',
};

export async function POST(req: Request) {
  try {
    const { accessToken, refreshToken, user } = await req.json();

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { success: false, message: 'Missing tokens' },
        { status: 400 }
      );
    }

    const res = NextResponse.json({ success: true });

    res.cookies.set('gr_at', accessToken, { ...cookieBase, maxAge: 60 * 60 * 6 });      // 6h
    res.cookies.set('gr_rt', refreshToken, { ...cookieBase, maxAge: 60 * 60 * 24 * 30 }); // 30d
    // lightweight, non-sensitive user cache (not strictly required)
    res.cookies.set('gr_user', JSON.stringify(user ?? {}), {
      ...cookieBase,
      httpOnly: false, // readable by client if needed
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Failed to set session' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set('gr_at', '', { ...cookieBase, maxAge: 0 });
  res.cookies.set('gr_rt', '', { ...cookieBase, maxAge: 0 });
  res.cookies.set('gr_user', '', { ...cookieBase, httpOnly: false, maxAge: 0 });
  return res;
}
