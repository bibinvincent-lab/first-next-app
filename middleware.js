import { NextResponse } from 'next/server';

export function middleware(request) {
  const sessionToken = request.cookies.get('sessionToken');
  const userEmail = request.cookies.get('userEmail');

  if (!sessionToken || !userEmail) {
    return NextResponse.redirect(new URL('/signup', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/blog/:path*'], // protect blog routes
};