import { NextResponse } from 'next/server';
import { getAuthCookie, getUserInfo } from '@/lib/auth';

export async function GET() {
  try {
    const token = await getAuthCookie();
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    // First try to get user from cookie
    const cachedUser = await getUserInfo();
    if (cachedUser) {
      return NextResponse.json(cachedUser);
    }

    // If no cached user, fetch from API
    const res = await fetch('https://api-yeshtery.dev.meetusvr.com/v1/user/info', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: error.message || 'Invalid or expired token' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('User info error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch user information' },
      { status: 500 }
    );
  }
}