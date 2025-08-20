import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token');
  const isAuthed = Boolean(token?.value);
  const { pathname } = req.nextUrl;

  // Handle root path (login page)
  if (pathname === '/') {
    if (isAuthed) {
      const url = new URL('/dashboard', req.url);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Public API routes
  if (pathname === '/api/login') {
    return NextResponse.next();
  }

  // Protected API routes
  if (pathname.startsWith('/api/')) {
    if (!isAuthed) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Protected page routes (everything else except public assets)
  if (!isAuthed) {
    const url = new URL('/', req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|favicon.ico|.*\\..*|_next/image|images|api/login).*)',
    '/api/:path*'
  ]
};