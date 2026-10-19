import { NextResponse } from "next/server";
import { DEFAULT_AVAILABILITY } from "@/app/config/availability";
import { getAuthenticatedUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { getMenuAvailability } from "@/lib/menuAvailability";
import Availability from "@/models/Availability";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ availability: await getMenuAvailability() });
  } catch (error) {
    console.error("Could not load menu availability:", error);
    return NextResponse.json({ error: "Unable to load item availability." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Please log in as a shopkeeper." }, { status: 401 });
    if (user.role !== "shopkeeper") {
      return NextResponse.json({ error: "Shopkeeper access is required." }, { status: 403 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid availability update." }, { status: 400 });
    }

    const data = body as Record<string, unknown>;
    if (
      typeof data.slug !== "string" ||
      !Object.hasOwn(DEFAULT_AVAILABILITY, data.slug) ||
      typeof data.isAvailable !== "boolean"
    ) {
      return NextResponse.json({ error: "Invalid item availability." }, { status: 400 });
    }

    await connectToDatabase();
    await getMenuAvailability();
    await Availability.updateOne(
      { key: "menu" },
      { $set: { [`items.${data.slug}`]: data.isAvailable } },
    );

    return NextResponse.json({ availability: await getMenuAvailability() });
  } catch (error) {
    console.error("Could not update menu availability:", error);
    return NextResponse.json({ error: "Unable to update item availability." }, { status: 500 });
  }
}
