// src/app/api/trips/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';            // file uploads के लिए Node runtime
export const dynamic = 'force-dynamic';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL_CURRENT_VERSION || '';

function joinUrl(base: string, path: string) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base.replace(/\/+$/, '')}${p}`;
}

export async function POST(req: NextRequest) {
  try {
    // client से आई multipart form-data पढ़ो
    const form = await req.formData();

    // auth header (cookie से)
    const jar = await cookies();
    const token =
      jar.get('gr_at')?.value ||
      jar.get('accessToken')?.value ||
      jar.get('Authorization')?.value ||
      '';

    // backend को वही form-data आगे भेजो
    const res = await fetch(joinUrl(API_BASE, '/groupAndTrip/trip-create'), {
      method: 'POST',
      // NOTE: Content-Type मत सेट करो, FormData boundary खुद लग जाएगी
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: token } : {}),
      },
      body: form,
    });

    // backend JSON pass-through
    let data: any = null;
    try { data = await res.json(); } catch { /* ignore bad json */ }

    if (!res.ok) {
      const message = (data && (data.message || data.error)) || `HTTP ${res.status}`;
      return NextResponse.json({ success: false, message }, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Trip create failed' },
      { status: 500 }
    );
  }
}
