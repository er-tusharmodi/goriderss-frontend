import { NextResponse } from 'next/server';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL_CURRENT_VERSION?.replace(/\/$/, '');

export async function POST(req: Request) {
  if (!API_BASE) {
    return NextResponse.json(
      { success: false, message: 'API base not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    const upstream = await fetch(`${API_BASE}/auth/user-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await upstream.text();

    const headers = new Headers();
    const ct = upstream.headers.get('content-type');
    if (ct) headers.set('content-type', ct);

    return new NextResponse(text, { status: upstream.status, headers });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Network error' },
      { status: 500 }
    );
  }
}
