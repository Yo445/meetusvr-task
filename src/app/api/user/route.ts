import { NextResponse } from 'next/server';
import { getAuthCookie } from '@/lib/auth';


export async function GET() {
const token = getAuthCookie();
if (!token) {
return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
}
const res = await fetch('https://api-yeshtery.dev.meetusvr.com/v1/user/info', {
method: 'GET',
headers: {
'Content-Type': 'application/json',
Authorization: `Bearer ${token}`,
},
});
if (!res.ok) {
return NextResponse.json({ message: 'Invalid or expired' }, { status: res.status });
}
const data = await res.json(); // { id, name, ... }
return NextResponse.json(data);
}