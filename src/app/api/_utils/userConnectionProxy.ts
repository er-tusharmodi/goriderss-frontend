import { cookies } from "next/headers";

const BASE = (
  process.env.NEXT_PUBLIC_API_URL_CURRENT_VERSION || 
  ""
).replace(/\/+$/, "");

async function authHeaders() {
  const jar = await cookies();
  const at =
    jar.get("gr_at")?.value ||
    jar.get("accessToken")?.value ||
    jar.get("Authorization")?.value || "";
  const h: Record<string,string> = { Accept: "application/json" };
  if (at) h.Authorization = at; // keep as-is (ideally 'Bearer ...')
  return h;
}

export async function forwardToUserConnection(req: Request, tail: string) {
  const qs = new URL(req.url).search;
  const url = `${BASE}/userConnection/${tail}${qs}`;
  const method = req.method.toUpperCase();
  const headers = await authHeaders();

  const init: RequestInit = {
    method,
    cache: "no-store",
    headers: {
      ...headers,
      ...(req.headers.get("content-type")
        ? { "Content-Type": String(req.headers.get("content-type")) }
        : {}),
    },
    body: ["GET", "HEAD"].includes(method) ? undefined : await req.arrayBuffer(),
  };

  const resp = await fetch(url, init);
  const ct = resp.headers.get("content-type") || "application/json";
  return new Response(resp.body, { status: resp.status, headers: { "Content-Type": ct } });
}
