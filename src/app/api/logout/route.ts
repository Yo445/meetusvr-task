import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/auth';


export async function POST() {
  try {
    await clearAuthCookies();
    
    // Set headers to prevent caching
    const headers = new Headers();
    headers.append('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    headers.append('Pragma', 'no-cache');
    headers.append('Expires', '0');
    
    return NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { 
        status: 200,
        headers
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Logout failed' },
      { status: 500 }
    );
  }
}