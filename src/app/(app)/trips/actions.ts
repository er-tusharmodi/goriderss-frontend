// src/app/api/trips/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic'; // no cache

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL_CURRENT_VERSION ||
  process.env.NEXT_PUBLIC_API_BASE ||
  '';

function joinUrl(base: string, path: string) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base.replace(/\/+$/, '')}${p}`;
}

// Create Trip (proxy to backend)
export async function POST(req: Request) {
  try {
    const formIn = await req.formData();

    const jar = await cookies();
    const at =
      jar.get('gr_at')?.value ||
      jar.get('accessToken')?.value ||
      jar.get('Authorization')?.value ||
      '';

    const url = joinUrl(API_BASE, '/groupAndTrip/trip-create');

    const res = await fetch(url, {
      method: 'POST',
      headers: at ? { Authorization: at } : undefined,
      body: formIn,                 // FormData pass through (image + fields)
      cache: 'no-store',
    });

    let data: any = null;
    try { data = await res.json(); } catch {}

    return NextResponse.json(data ?? { ok: res.ok }, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || 'Trip create failed' },
      { status: 500 }
    );
  }
}

/* (Optional) future:
export async function GET() { ... }   // list trips
*/
