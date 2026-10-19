import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

export const runtime = "nodejs";

const paymentStatuses = ["Payment Verified", "Payment Rejected"] as const;
const orderStatuses = ["Order Accepted", "Preparing", "Ready", "Completed"] as const;

async function shopkeeperAccess() {
  const user = await getAuthenticatedUser();
  if (!user) return { response: NextResponse.json({ error: "Please log in." }, { status: 401 }) };
  if (user.role !== "shopkeeper") {
    return { response: NextResponse.json({ error: "Shopkeeper access is required." }, { status: 403 }) };
  }
  return { user };
}

export async function GET() {
  try {
    const access = await shopkeeperAccess();
    if (access.response) return access.response;

    await connectToDatabase();
    const orders = await Order.find({})
      .select("-screenshot -screenshotContentType")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({
      orders: orders.map((order) => ({
        id: String(order._id),
        customerName: order.customerName,
        mobile: order.mobile,
        items: order.items,
        total: order.total,
        paymentMethod: order.paymentMethod,
        transactionId: order.transactionId,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
      })),
    });
  } catch (error) {
    console.error("Could not load shopkeeper orders:", error);
    return NextResponse.json({ error: "Unable to load orders." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const access = await shopkeeperAccess().catch((error: unknown) => {
    console.error("Could not verify shopkeeper access:", error);
    return { response: NextResponse.json({ error: "Unable to verify access." }, { status: 500 }) };
  });
  if (access.response) return access.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid order update." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  if (typeof data.orderId !== "string" || !/^[a-f\d]{24}$/i.test(data.orderId)) {
    return NextResponse.json({ error: "Invalid order ID." }, { status: 400 });
  }
  const isPaymentUpdate = typeof data.paymentStatus === "string";
  if (
    isPaymentUpdate
      ? !paymentStatuses.includes(data.paymentStatus as (typeof paymentStatuses)[number])
      : !orderStatuses.includes(data.orderStatus as (typeof orderStatuses)[number])
  ) {
    return NextResponse.json({ error: "Invalid status update." }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const order = await Order.findById(data.orderId);
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

    if (isPaymentUpdate) {
      if (order.paymentStatus !== "Payment Verification Pending") {
        return NextResponse.json({ error: "Payment has already been reviewed." }, { status: 409 });
      }
      order.paymentStatus = data.paymentStatus as (typeof paymentStatuses)[number];
      if (order.paymentStatus === "Payment Rejected") order.orderStatus = "Rejected";
    } else {
      if (order.paymentStatus !== "Payment Verified") {
        return NextResponse.json({ error: "Verify payment before processing the order." }, { status: 409 });
      }
      const allowedNext: Record<string, string> = {
        "Payment Verification Pending": "Order Accepted",
        "Order Accepted": "Preparing",
        Preparing: "Ready",
        Ready: "Completed",
      };
      if (allowedNext[order.orderStatus] !== data.orderStatus) {
        return NextResponse.json({ error: "That order status transition is not allowed." }, { status: 409 });
      }
      order.orderStatus = data.orderStatus as (typeof orderStatuses)[number];
    }

    await order.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Could not update shopkeeper order:", error);
    return NextResponse.json({ error: "Unable to update the order." }, { status: 500 });
  }
}
