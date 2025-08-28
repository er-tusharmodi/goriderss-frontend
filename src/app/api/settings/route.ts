// src/app/api/settings/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL_CURRENT_VERSION || 
  ""
).replace(/\/+$/, "");

function fwd(req: NextRequest) {
  const h = new Headers();
  const auth = req.headers.get("authorization");
  const cookie = req.headers.get("cookie");
  if (auth) h.set("authorization", auth);
  if (cookie) h.set("cookie", cookie);
  h.set("accept", "application/json");
  h.set("content-type", "application/json");
  return h;
}

export async function GET(req: NextRequest) {
  const upstream = await fetch(`${API_BASE}/settings`, {
    method: "GET",
    headers: fwd(req),
    // @ts-ignore
    duplex: "half",
  });
  const body = await upstream.text();
  return new NextResponse(body, {
    status: upstream.status,
    headers: { "content-type": upstream.headers.get("content-type") || "application/json" },
  });
}

export async function PUT(req: NextRequest) {
  const body = await req.text();
  const upstream = await fetch(`${API_BASE}/settings`, {
    method: "PUT",
    headers: fwd(req),
    body,
    // @ts-ignore
    duplex: "half",
  });
  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: { "content-type": upstream.headers.get("content-type") || "application/json" },
  });
}
