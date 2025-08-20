import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const payload = {
      email: body.email,
      password: body.password,
      isEmployee: true
    };
    console.log("payload", payload);
    const res = await fetch(
      "https://api-yeshtery.dev.meetusvr.com/v1/yeshtery/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );
    if (!res.ok) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: res.status }
      );
    }

    const data = await res.json(); // { token, refresh, ... }
    console.log("res", data);
    const token = data.token;
    if (!token)
      return NextResponse.json({ message: "Token missing" }, { status: 500 });

    setAuthCookie(token);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}


/* 
zod
react hook form 
server action
form stattus
error handling
*/