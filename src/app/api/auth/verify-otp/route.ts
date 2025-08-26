import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL_CURRENT_VERSION?.replace(/\/$/, '');

export async function POST(req: Request) {
  if (!API_BASE) {
    return NextResponse.json({ success: false, message: 'API base not configured' }, { status: 500 });
  }
  try {
    const body = await req.json();
    const r = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await r.text();
    const headers = new Headers();
    const ct = r.headers.get('content-type');
    if (ct) headers.set('content-type', ct);

    return new NextResponse(text, { status: r.status, headers });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e?.message || 'Network error' }, { status: 500 });
  }
}
