import { NextResponse } from "next/server";
import { TEXT } from "@/app/constants";
import { getAuthenticatedUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: TEXT.api.loginRequired }, { status: 401 });
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (error) {
    console.error("Could not load signed-in user:", error);
    return NextResponse.json({ error: TEXT.api.login.accountLoadFailed }, { status: 500 });
  }
}
