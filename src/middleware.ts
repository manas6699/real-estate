import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  // 1. Redirect logged-in users away from login page
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/admin/LeadData', request.url));
  }

  // 2. Protect admin routes
  const isProtected = pathname.startsWith('/admin');
  
  if (isProtected) {
    // 2a. Check for token
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2b. Add security headers for protected routes
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/login'
  ],
};