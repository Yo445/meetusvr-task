'use server';
import { cookies } from 'next/headers';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};
import { z } from 'zod';
import { AuthResponse, ApiError } from './types';

const TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';
const USER_COOKIE = 'user_info';

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export async function login(data: LoginInput): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate input
    const validated = loginSchema.parse(data);

    const res = await fetch("https://api-yeshtery.dev.meetusvr.com/v1/yeshtery/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...validated, isEmployee: true }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Invalid credentials');
    }

    const authData: AuthResponse = await res.json();
    
    // Set cookies
    const cookieStore = await cookies();
    
    cookieStore.set({
      name: TOKEN_COOKIE,
      value: authData.token,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    cookieStore.set({
      name: REFRESH_TOKEN_COOKIE,
      value: authData.refresh,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // Store user info in a cookie (non-sensitive data only)
    cookieStore.set({
      name: USER_COOKIE,
      value: JSON.stringify({
        id: authData.userInfo.id,
        name: authData.userInfo.name,
        email: authData.userInfo.email,
        roles: authData.userInfo.roles,
      }),
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  const expires = new Date(0);
  
  [TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, USER_COOKIE].forEach(name => {
    cookieStore.set({ name, value: '', path: '/', httpOnly: true, expires });
  });
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
}

export async function getUserInfo() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get(USER_COOKIE)?.value;
  if (!userCookie) return null;
  
  try {
    return JSON.parse(userCookie);
  } catch {
    return null;
  }
}
