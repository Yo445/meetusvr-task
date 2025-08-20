import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token');
  const isAuthed = Boolean(token?.value);
  const pathname = req.nextUrl.pathname;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/api/login')
  ) {
    return NextResponse.next();
  }

  // Handle authentication routes
  if (pathname === '/') {
    if (isAuthed) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // Protected API routes
  if (pathname.startsWith('/api/')) {
    if (!isAuthed) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Protected routes
  if (!isAuthed && pathname !== '/') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|favicon.ico|.*\\..*|_next/image|images|api/login).*)',
    '/api/:path*'
  ]
};