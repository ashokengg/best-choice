import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import FestivalSettings from "@/models/FestivalSettings";
import { TEXT } from "@/app/constants";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectToDatabase();
    const settings = await FestivalSettings.findOne({ key: "festival" }).select(
      "makarSankrantiAnimationEnabled",
    );
    return NextResponse.json({
      enabled: settings?.makarSankrantiAnimationEnabled === true,
    });
  } catch (error) {
    console.error("Could not load festival animation setting:", error);
    return NextResponse.json(
      { error: TEXT.api.festivalAnimation.loadFailed },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: TEXT.api.shopkeeperLoginRequired }, { status: 401 });
    }
    if (user.role !== "shopkeeper") {
      return NextResponse.json({ error: TEXT.api.shopkeeperRequired }, { status: 403 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: TEXT.api.requestJson }, { status: 400 });
    }
    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body) ||
      typeof (body as Record<string, unknown>).enabled !== "boolean"
    ) {
      return NextResponse.json(
        { error: TEXT.api.festivalAnimation.invalidSetting },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const enabled = (body as { enabled: boolean }).enabled;
    await FestivalSettings.updateOne(
      { key: "festival" },
      { $set: { makarSankrantiAnimationEnabled: enabled } },
      { upsert: true },
    );

    return NextResponse.json({ enabled });
  } catch (error) {
    console.error("Could not update festival animation setting:", error);
    return NextResponse.json(
      { error: TEXT.api.festivalAnimation.updateFailed },
      { status: 500 },
    );
  }
}
