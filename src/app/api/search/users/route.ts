// src/app/api/search/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_URL_CURRENT_VERSION || ""; // e.g. http://localhost:5000/api/v1
const UPSTREAM_PATH = "/UserProfile/search-users"; // GET only

function joinBaseAndPath(base: string, path: string) {
  const u = new URL(base);
  // ensure exactly one slash between base pathname and path
  const basePath = u.pathname.replace(/\/+$/, "");
  const addPath  = path.replace(/^\/+/, "");
  u.pathname = `${basePath}/${addPath}`;
  return u;
}

export async function GET(req: NextRequest) {
  if (!API_BASE) {
    return NextResponse.json(
      { success: false, message: "Missing NEXT_PUBLIC_API_URL_CURRENT_VERSION" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const q     = (searchParams.get("q") || "").trim();
  const page  = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "24";

  // Build upstream URL WITHOUT losing /api/v1
  const u = joinBaseAndPath(API_BASE, UPSTREAM_PATH);
  u.searchParams.set("q", q);
  u.searchParams.set("page", page);
  u.searchParams.set("limit", limit);

  // auth from header or cookies
  const jar = await cookies();
  const cookieAuth =
    jar.get("gr_at")?.value ||
    jar.get("accessToken")?.value ||
    jar.get("Authorization")?.value ||
    "";
  const hdrAuth = req.headers.get("authorization") || "";
  const Authorization = hdrAuth || cookieAuth;
  const cookieHeader = req.headers.get("cookie") || "";

  const upstreamRes = await fetch(u.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(Authorization ? { Authorization } : {}),
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    cache: "no-store",
  });

  const text = await upstreamRes.text();
  try {
    const json = text ? JSON.parse(text) : {};
    return NextResponse.json(json, { status: upstreamRes.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Upstream returned non-JSON", raw: text },
      { status: 502 }
    );
  }
}
