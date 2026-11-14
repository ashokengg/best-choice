import { NextResponse } from "next/server";
import { PRODUCTS } from "@/app/config/products";
import { DEFAULT_SPECIAL_ITEMS, MAX_SPECIAL_ITEMS } from "@/app/config/specialItems";
import { getAuthenticatedUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import SpecialItems from "@/models/SpecialItems";
import { TEXT } from "@/app/constants";

export const runtime = "nodejs";

const validSlugs = new Set(PRODUCTS.map((product) => product.slug));

async function getSpecialItems() {
  const document = await SpecialItems.findOneAndUpdate(
    { key: "header" },
    { $setOnInsert: { items: DEFAULT_SPECIAL_ITEMS } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
  const items = Array.isArray(document.items) ? document.items : DEFAULT_SPECIAL_ITEMS;
  return [...new Set(items.filter(
    (slug: string) => typeof slug === "string" && validSlugs.has(slug),
  ))].slice(0, MAX_SPECIAL_ITEMS);
}

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ items: await getSpecialItems() });
  } catch (error) {
    console.error("Could not load header special items:", error);
    return NextResponse.json({ error: TEXT.api.specialItems.loadFailed }, { status: 500 });
  }
}

export async function PUT(request: Request) {
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
    if (!body || typeof body !== "object" || Array.isArray(body) || !Array.isArray((body as Record<string, unknown>).items)) {
      return NextResponse.json({ error: TEXT.api.specialItems.invalidList }, { status: 400 });
    }

    const items: unknown[] = (body as { items: unknown[] }).items;
    if (
      items.length > MAX_SPECIAL_ITEMS ||
      items.some((slug) => typeof slug !== "string" || !validSlugs.has(slug)) ||
      new Set(items).size !== items.length
    ) {
      return NextResponse.json(
        { error: TEXT.api.specialItems.invalidSelection(MAX_SPECIAL_ITEMS) },
        { status: 400 },
      );
    }

    await connectToDatabase();
    await SpecialItems.updateOne(
      { key: "header" },
      { $set: { items } },
      { upsert: true },
    );

    return NextResponse.json({ items: await getSpecialItems() });
  } catch (error) {
    console.error("Could not save header special items:", error);
    return NextResponse.json({ error: TEXT.api.specialItems.saveFailed }, { status: 500 });
  }
}
