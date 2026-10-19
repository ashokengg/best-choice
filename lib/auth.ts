import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import Session from "@/models/Session";
import User from "@/models/User";

export const SESSION_COOKIE = "best-choice-session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createUserSession(userId: string) {
  await connectToDatabase();
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await Session.create({ userId, tokenHash: hashSessionToken(token), expiresAt });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function getAuthenticatedUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  await connectToDatabase();
  const session = await Session.findOne({
    tokenHash: hashSessionToken(token),
    expiresAt: { $gt: new Date() },
  }).select("userId");
  if (!session) return null;

  return User.findById(session.userId).select("name email phone role");
}
