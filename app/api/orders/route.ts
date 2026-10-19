import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { DELIVERY_FEE } from "@/app/config/shop";
import { PRODUCTS_BY_SLUG } from "@/app/config/products";
import { connectToDatabase } from "@/lib/mongodb";
import { getMenuAvailability } from "@/lib/menuAvailability";
import Order from "@/models/Order";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });

    await connectToDatabase();
    const orders = await Order.find({ userId: user.id })
      .select("-screenshot -screenshotContentType")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      orders: orders.map((order) => ({
        id: String(order._id),
        items: order.items,
        total: order.total,
        transactionId: order.transactionId,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
      })),
    });
  } catch (error) {
    console.error("Could not load order history:", error);
    return NextResponse.json({ error: "Unable to load order history." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid order submission." }, { status: 400 });
  }

  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Please log in before ordering." }, { status: 401 });

    const customerName = String(form.get("customerName") || "").trim();
    const mobile = String(form.get("mobile") || "").trim();
    const transactionId = String(form.get("transactionId") || "").trim();
    const image = form.get("screenshot");
    let rawItems: unknown;
    try {
      rawItems = JSON.parse(String(form.get("items") || ""));
    } catch {
      return NextResponse.json({ error: "Invalid order items." }, { status: 400 });
    }

    if (!customerName || customerName.length > 100 || !/^\+?[0-9]{10,15}$/.test(mobile) ||
      !transactionId || transactionId.length > 100 || !(image instanceof File) ||
      !["image/jpeg", "image/png", "image/webp"].includes(image.type) || image.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Check your contact, payment, and screenshot details." }, { status: 400 });
    }
    if (!Array.isArray(rawItems) || rawItems.length < 1 || rawItems.length > 30) {
      return NextResponse.json({ error: "Your cart is empty or has too many items." }, { status: 400 });
    }

    const items = [];
    await connectToDatabase();
    const availability = await getMenuAvailability();
    for (const rawItem of rawItems) {
      if (!rawItem || typeof rawItem !== "object") {
        return NextResponse.json({ error: "Invalid item in order." }, { status: 400 });
      }
      const item = rawItem as Record<string, unknown>;
      const product = typeof item.slug === "string" ? PRODUCTS_BY_SLUG[item.slug] : undefined;
      const quantity = item.quantity;
      if (!product || !Number.isInteger(quantity) || Number(quantity) < 1 || Number(quantity) > 99) {
        return NextResponse.json({ error: "Invalid product or quantity in order." }, { status: 400 });
      }
      if (!availability[item.slug as string]) {
        return NextResponse.json({ error: `${product.title} is not currently available.` }, { status: 409 });
      }
      items.push({
        slug: product.slug,
        title: product.title,
        price: product.price,
        img: product.img,
        quantity: Number(quantity),
      });
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0) + DELIVERY_FEE;
    const order = await Order.create({
      userId: user.id,
      customerName,
      mobile,
      items,
      total,
      transactionId,
      screenshot: Buffer.from(await image.arrayBuffer()),
      screenshotContentType: image.type,
    });

    return NextResponse.json({ orderId: String(order._id), total }, { status: 201 });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json({ error: "Unable to submit your order right now." }, { status: 500 });
  }
}
