import { NextResponse } from "next/server";
import { login } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await login(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error || "Login failed" },
        { status: 401 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Login route error:", e);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}