// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED = ['/dashboard']; // चाहो तो '/profile', '/settings' आदि जोड़ो

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // सिर्फ protected paths पर लागू करो
  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (!isProtected) return NextResponse.next();

  // httpOnly access token cookie चाहिए
  const access = req.cookies.get('gr_at')?.value;

  if (!access) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname); // back-to after login
    return NextResponse.redirect(url);
  }

  // (Optional) यहाँ JWT decode/expiry validate कर सकते हैं

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], // ऊपर PROTECTED array से match हो रहा है
};
