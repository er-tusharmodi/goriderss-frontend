// app/api/profile/route.ts
import { cookies } from 'next/headers';

const API = process.env.NEXT_PUBLIC_API_URL_CURRENT_VERSION?.replace(/\/$/, '');

export const runtime = 'nodejs'; // multipart-friendly

function backend(url: string) {
  if (!API) throw new Error('API base not configured');
  return `${API}${url.startsWith('/') ? '' : '/'}${url}`;
}

export async function GET() {
  const store = await cookies();
  const at = store.get('gr_at')?.value;
  if (!at) return new Response('Unauthorized', { status: 401 });

  const r = await fetch(backend('/users/me'), {
    headers: { Authorization: `Bearer ${at}` },
    cache: 'no-store',
  });
  const j = await r.json().catch(() => ({}));
  return Response.json(j, { status: r.status });
}

export async function PUT(req: Request) {
  const store = await cookies();
  const at = store.get('gr_at')?.value;
  if (!at) return new Response('Unauthorized', { status: 401 });

  const ct = req.headers.get('content-type') || '';

  let r: Response;
  if (ct.includes('multipart/form-data')) {
    const fd = await req.formData();
    // Forward form-data as-is
    r = await fetch(backend('/users/update-profile'), {
      method: 'PUT',
      headers: { Authorization: `Bearer ${at}` },
      body: fd,
    });
  } else {
    const body = await req.json().catch(() => ({}));
    r = await fetch(backend('/users/update-profile'), {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${at}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }

  const j = await r.json().catch(async () => ({ message: await r.text().catch(() => '') }));
  return Response.json(j, { status: r.status });
}
