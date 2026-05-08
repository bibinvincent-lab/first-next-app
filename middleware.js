import { NextResponse } from 'next/server';
import { validateSessionEdge } from '@/lib/edgeSession';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get session token from cookies
  const sessionToken = request.cookies.get('sessionToken')?.value;

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/'];
  
  // Check if current path is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // If user is already authenticated, redirect from login/register to appropriate dashboard
  if (sessionToken && (pathname === '/login' || pathname === '/register')) {
    // Validate session before redirecting
    const isValidSession = await validateSessionEdge(sessionToken);
    if (isValidSession) {
      return NextResponse.redirect(new URL('/user/dashboard', request.url));
    }
  }

  // Protected routes - check for session token
  const protectedRoutes = [
    '/admin/:path*',
    '/manager/:path*', 
    '/user/:path*',
    '/blog/:path*'
  ];

  // Check if current path matches any protected route pattern
  const isProtectedRoute = protectedRoutes.some(route => {
    if (route.includes(':path*')) {
      const basePath = route.replace('/:path*', '');
      return pathname.startsWith(basePath);
    }
    return pathname === route;
  });

  // If accessing protected route, validate session
  if (isProtectedRoute) {
    if (!sessionToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Validate session token using Edge-compatible validation
    const isValidSession = await validateSessionEdge(sessionToken);
    if (!isValidSession) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('reason', 'session_expired');
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/manager/:path*',
    '/user/:path*',
    '/blog/:path*',
    '/login',
    '/register',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};