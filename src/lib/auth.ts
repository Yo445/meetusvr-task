'use server';
import { cookies } from 'next/headers';

const TOKEN_COOKIE = 'access_token'; // ✅ no export

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: TOKEN_COOKIE,
    value: token,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: TOKEN_COOKIE,
    value: '',
    path: '/',
    httpOnly: true,
    expires: new Date(0),
  });
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE)?.value;
}
