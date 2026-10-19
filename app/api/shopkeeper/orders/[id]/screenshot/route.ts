import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });
    if (user.role !== "shopkeeper") {
      return NextResponse.json({ error: "Shopkeeper access is required." }, { status: 403 });
    }

    const { id } = await params;
    if (!/^[a-f\d]{24}$/i.test(id)) {
      return NextResponse.json({ error: "Invalid order ID." }, { status: 400 });
    }
    await connectToDatabase();
    const order = await Order.findById(id).select("+screenshot +screenshotContentType");
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

    return new NextResponse(order.screenshot, {
      headers: {
        "Content-Type": order.screenshotContentType,
        "Content-Disposition": "inline",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Could not load payment screenshot:", error);
    return NextResponse.json({ error: "Unable to load payment screenshot." }, { status: 500 });
  }
}
