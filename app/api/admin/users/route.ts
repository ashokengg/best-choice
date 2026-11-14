import { NextResponse } from "next/server";
import { TEXT } from "@/app/constants";
import { getAuthenticatedUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Session from "@/models/Session";
import User from "@/models/User";

export const runtime = "nodejs";

const PAGE_SIZE = 25;
const MANAGEABLE_ROLES = ["customer", "shopkeeper"] as const;
type ManageableRole = (typeof MANAGEABLE_ROLES)[number];

async function requireAdmin() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { response: NextResponse.json({ error: TEXT.api.loginRequired }, { status: 401 }) };
  }
  if (user.role !== "admin") {
    return { response: NextResponse.json({ error: TEXT.api.admin.required }, { status: 403 }) };
  }
  return { user };
}

export async function GET(request: Request) {
  try {
    const access = await requireAdmin();
    if (access.response) return access.response;

    const url = new URL(request.url);
    const requestedPage = Number(url.searchParams.get("page") || 1);
    const search = (url.searchParams.get("q") || "").trim();
    if (!Number.isInteger(requestedPage) || requestedPage < 1 || search.length > 100) {
      return NextResponse.json({ error: TEXT.api.admin.invalidQuery }, { status: 400 });
    }

    await connectToDatabase();
    const filter = search
      ? {
          $or: ["name", "email", "phone"].map((field) => ({
            [field]: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" },
          })),
        }
      : {};
    const total = await User.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const page = Math.min(requestedPage, totalPages);
    const users = await User.find(filter)
      .select("_id name email phone role createdAt")
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean();

    return NextResponse.json({
      users: users.map((user) => ({
        id: String(user._id),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      })),
      page,
      pageSize: PAGE_SIZE,
      total,
      totalPages,
    });
  } catch (error) {
    console.error("Could not load admin user list:", error);
    return NextResponse.json({ error: TEXT.api.admin.loadFailed }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  let access: Awaited<ReturnType<typeof requireAdmin>>;
  try {
    access = await requireAdmin();
  } catch (error) {
    console.error("Could not verify admin access:", error);
    return NextResponse.json({ error: TEXT.api.admin.verifyFailed }, { status: 500 });
  }
  if (access.response) return access.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: TEXT.api.requestJson }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: TEXT.api.admin.invalidUpdate }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const userId = typeof data.userId === "string" ? data.userId : "";
  const role = data.role;
  if (!/^[a-f\d]{24}$/i.test(userId) || !MANAGEABLE_ROLES.includes(role as ManageableRole)) {
    return NextResponse.json({ error: TEXT.api.admin.invalidUpdate }, { status: 400 });
  }
  if (userId === access.user.id) {
    return NextResponse.json({ error: TEXT.api.admin.cannotChangeSelf }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const user = await User.findOneAndUpdate(
      { _id: userId, role: { $in: MANAGEABLE_ROLES } },
      { $set: { role } },
      { new: true, runValidators: true },
    ).select("_id name email phone role createdAt");

    if (!user) {
      return NextResponse.json({ error: TEXT.api.admin.userNotFound }, { status: 404 });
    }

    await Session.deleteMany({ userId: user._id });
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
      message: TEXT.api.admin.accessUpdated,
    });
  } catch (error) {
    console.error("Could not update user access:", error);
    return NextResponse.json({ error: TEXT.api.admin.updateFailed }, { status: 500 });
  }
}
