// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL_CURRENT_VERSION?.replace(/\/$/, '') || '';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const upstream = await fetch(`${API_BASE}/auth/login-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await upstream.text();

    const headers = new Headers();
    const ct = upstream.headers.get('content-type');
    if (ct) headers.set('content-type', ct);

    // forward Set-Cookie from backend if it sends any
    const setCookie = upstream.headers.get('set-cookie');
    if (setCookie) headers.append('set-cookie', setCookie);

    return new NextResponse(text, { status: upstream.status, headers });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Network error' },
      { status: 500 }
    );
  }
}
