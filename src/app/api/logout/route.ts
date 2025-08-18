// app/api/logout/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const res = NextResponse.json({ success: true });

  // Expire now
  res.cookies.set('gr_at', '', { path: '/', expires: new Date(0) });
  res.cookies.set('gr_rt', '', { path: '/', expires: new Date(0) });
  res.cookies.set('gr_name', '', { path: '/', expires: new Date(0) });

  return res;
}
