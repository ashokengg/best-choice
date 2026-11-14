import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import {
  sendPasswordResetEmail,
  validatePasswordResetEmailConfig,
} from "@/lib/passwordResetEmail";
import PasswordResetToken from "@/models/PasswordResetToken";
import User from "@/models/User";
import { hashSessionToken } from "@/lib/auth";
import { TEXT } from "@/app/constants";

export const runtime = "nodejs";

const RESET_TOKEN_DURATION_MS = 30 * 60 * 1000;
const RESET_REQUEST_COOLDOWN_MS = 60 * 1000;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: TEXT.api.requestJson }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: TEXT.api.forgotPassword.invalidRequest }, { status: 400 });
  }

  const email = typeof (body as Record<string, unknown>).email === "string"
    ? (body as { email: string }).email.trim().toLowerCase()
    : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: TEXT.api.forgotPassword.invalidEmail }, { status: 400 });
  }

  try {
    validatePasswordResetEmailConfig();
  } catch (error) {
    console.error("Password reset email configuration is incomplete:", error);
    return NextResponse.json(
      { error: TEXT.api.forgotPassword.emailNotConfigured },
      { status: 503 },
    );
  }

  try {
    await connectToDatabase();
    const user = await User.findOne({ email }).select("_id email");
    if (user) {
      const now = new Date();
      const existingToken = await PasswordResetToken.findOne({ userId: user._id }).select(
        "requestedAt",
      );
      if (
        !existingToken ||
        now.getTime() - existingToken.requestedAt.getTime() >= RESET_REQUEST_COOLDOWN_MS
      ) {
        const token = randomBytes(32).toString("hex");
        await PasswordResetToken.findOneAndUpdate(
          { userId: user._id },
          {
            $set: {
              tokenHash: hashSessionToken(token),
              expiresAt: new Date(now.getTime() + RESET_TOKEN_DURATION_MS),
              requestedAt: now,
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        );

        try {
          await sendPasswordResetEmail(user.email, token);
        } catch (error) {
          await PasswordResetToken.deleteOne({ userId: user._id, tokenHash: hashSessionToken(token) });
          throw error;
        }
      }
    }

    return NextResponse.json({ message: TEXT.auth.resetEmailIfRegistered });
  } catch (error) {
    console.error("Could not process password reset request:", error);
    return NextResponse.json(
      { error: TEXT.api.forgotPassword.sendFailed },
      { status: 503 },
    );
  }
}
