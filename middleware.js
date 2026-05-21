import { NextResponse } from 'next/server';

// Session token format validation (Edge-compatible, no Node.js crypto)
const SESSION_TOKEN_LENGTH = 64;
function isValidSessionTokenFormat(token) {
  return typeof token === 'string' &&
    token.length === SESSION_TOKEN_LENGTH * 2 &&
    /^[a-f0-9]+$/i.test(token);
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const sessionToken = request.cookies.get('sessionToken')?.value;

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register'];

  if (publicRoutes.includes(pathname)) {
    // If already authenticated, redirect away from login/register
    if (sessionToken && isValidSessionTokenFormat(sessionToken)) {
      return NextResponse.redirect(new URL('/user/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // All other routes require authentication
  if (!sessionToken || !isValidSessionTokenFormat(sessionToken)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};