import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { createUserSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid login details." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const identifier = typeof data.identifier === "string" ? data.identifier.trim() : "";
  const password = typeof data.password === "string" ? data.password : "";
  if (!identifier || !password) {
    return NextResponse.json({ error: "Enter your email or mobile number and password." }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const normalizedIdentifier = identifier.includes("@")
      ? identifier.toLowerCase()
      : identifier;
    const user = await User.findOne({
      $or: [{ email: normalizedIdentifier }, { phone: normalizedIdentifier }],
    }).select("+passwordHash");

    if (!user || !(await compare(password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid email/mobile number or password." }, { status: 401 });
    }

    await createUserSession(user.id);
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (error) {
    console.error("User login failed:", error);
    return NextResponse.json({ error: "Unable to log in right now. Please try again." }, { status: 500 });
  }
}
