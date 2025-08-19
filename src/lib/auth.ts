'use server';
import { cookies } from 'next/headers';


export const TOKEN_COOKIE = 'access_token';


export function setAuthCookie(token: string) {
cookies().set({
name: TOKEN_COOKIE,
value: token,
httpOnly: true,
path: '/',
sameSite: 'lax',
secure: process.env.NODE_ENV === 'production',
});
}


export function clearAuthCookie() {
cookies().set({ name: TOKEN_COOKIE, value: '', path: '/', httpOnly: true, expires: new Date(0) });
}


export function getAuthCookie(): string | undefined {
return cookies().get(TOKEN_COOKIE)?.value;
}