import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { hashSessionToken } from "@/lib/auth";
import PasswordResetToken from "@/models/PasswordResetToken";
import Session from "@/models/Session";
import User from "@/models/User";
import { TEXT } from "@/app/constants";

export const runtime = "nodejs";

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: TEXT.api.requestJson }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: TEXT.api.resetPassword.invalidRequest }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const token = typeof data.token === "string" ? data.token : "";
  const password = typeof data.password === "string" ? data.password : "";
  if (!/^[a-f0-9]{64}$/.test(token)) {
    return NextResponse.json({ error: TEXT.api.resetPassword.invalidToken }, { status: 400 });
  }
  if (!PASSWORD_PATTERN.test(password)) {
    return NextResponse.json({ error: TEXT.api.resetPassword.invalidPassword }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const resetToken = await PasswordResetToken.findOneAndDelete({
      tokenHash: hashSessionToken(token),
      expiresAt: { $gt: new Date() },
    });
    if (!resetToken) {
      return NextResponse.json({ error: TEXT.api.resetPassword.invalidToken }, { status: 400 });
    }

    const passwordHash = await hash(password, 12);
    const update = await User.updateOne(
      { _id: resetToken.userId },
      { $set: { passwordHash } },
    );
    if (update.matchedCount !== 1) {
      return NextResponse.json({ error: TEXT.api.resetPassword.invalidToken }, { status: 400 });
    }

    await Session.deleteMany({ userId: resetToken.userId });
    await PasswordResetToken.deleteMany({ userId: resetToken.userId });
    return NextResponse.json({ message: TEXT.auth.passwordResetComplete });
  } catch (error) {
    console.error("Could not reset account password:", error);
    return NextResponse.json(
      { error: TEXT.api.resetPassword.failed },
      { status: 500 },
    );
  }
}
