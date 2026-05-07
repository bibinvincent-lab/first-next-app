import { NextResponse } from 'next/server';

export function middleware(request) {
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
    // For now, redirect to user dashboard as default
    return NextResponse.redirect(new URL('/user/dashboard', request.url));
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

  // If accessing protected route without session token, redirect to login
  if (isProtectedRoute && !sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow access to protected routes if session token exists
  // Note: Actual session validation happens in the API routes
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