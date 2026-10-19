import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { hashSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Session from "@/models/Session";

export const runtime = "nodejs";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  cookieStore.delete(SESSION_COOKIE);

  try {
    if (token) {
      await connectToDatabase();
      await Session.deleteOne({ tokenHash: hashSessionToken(token) });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("User logout failed:", error);
    return NextResponse.json({ error: "Unable to log out right now." }, { status: 500 });
  }
}
