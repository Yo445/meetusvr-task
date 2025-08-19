import { NextRequest, NextResponse } from 'next/server';


export function middleware(req: NextRequest) {
const token = req.cookies.get('access_token');
const isAuthed = Boolean(token?.value);
const { pathname } = req.nextUrl;


if (pathname.startsWith('/dashboard') && !isAuthed) {
const url = new URL('/', req.url);
return NextResponse.redirect(url);
}
if (pathname === '/' && isAuthed) {
const url = new URL('/dashboard', req.url);
return NextResponse.redirect(url);
}
return NextResponse.next();
}


export const config = {
matcher: ['/', '/dashboard/:path*']
};