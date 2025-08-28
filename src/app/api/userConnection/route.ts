import { cookies } from "next/headers";

export const runtime = "nodejs";
export const revalidate = 0;
export const dynamic = "force-dynamic";

// BASE must be WITHOUT `/userConnection`
const BASE = (
  process.env.NEXT_PUBLIC_API_URL_CURRENT_VERSION || 
  ""
).replace(/\/+$/, "");

function stripPrefix(s: string) {
  return s.replace(/^\/+/, "");
}

export async function ALL(req: Request) {
  const url = new URL(req.url);
  const path = url.searchParams.get("path");
  if (!path) {
    return Response.json({ success: false, message: "Missing ?path" }, { status: 400 });
  }

  // rebuild query WITHOUT `path`
  url.searchParams.delete("path");
  const restQS = url.searchParams.toString();
  const target = `${BASE}/userConnection/${stripPrefix(path)}${restQS ? `?${restQS}` : ""}`;

  // auth from cookies -> Authorization header
  const jar = await cookies();
  const at =
    jar.get("gr_at")?.value ||
    jar.get("accessToken")?.value ||
    jar.get("Authorization")?.value ||
    "";

  const method = req.method.toUpperCase();
  const init: RequestInit = {
    method,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(at ? { Authorization: at } : {}),
      ...(req.headers.get("content-type")
        ? { "Content-Type": String(req.headers.get("content-type")) }
        : {}),
    },
    body: ["GET", "HEAD"].includes(method) ? undefined : await req.arrayBuffer(),
  };

  const resp = await fetch(target, init);
  const ct = resp.headers.get("content-type") || "application/json";
  return new Response(resp.body, { status: resp.status, headers: { "Content-Type": ct } });
}

// Map all verbs to the same handler
export { ALL as GET, ALL as POST, ALL as PUT, ALL as PATCH, ALL as DELETE, ALL as HEAD, ALL as OPTIONS };
