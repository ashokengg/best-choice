import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import { ORDER_STATUSES, TEXT } from "@/app/constants";

export const runtime = "nodejs";

const paymentStatuses = [ORDER_STATUSES.paymentVerified, ORDER_STATUSES.paymentRejected] as const;
const orderStatuses = [ORDER_STATUSES.orderAccepted, ORDER_STATUSES.preparing, ORDER_STATUSES.ready, ORDER_STATUSES.completed] as const;

async function shopkeeperAccess() {
  const user = await getAuthenticatedUser();
  if (!user) return { response: NextResponse.json({ error: TEXT.api.loginRequired }, { status: 401 }) };
  if (user.role !== "shopkeeper") {
    return { response: NextResponse.json({ error: TEXT.api.shopkeeperRequired }, { status: 403 }) };
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
    return NextResponse.json({ error: TEXT.api.shopkeeperOrders.loadFailed }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const access = await shopkeeperAccess().catch((error: unknown) => {
    console.error("Could not verify shopkeeper access:", error);
    return { response: NextResponse.json({ error: TEXT.api.orders.verifyAccess }, { status: 500 }) };
  });
  if (access.response) return access.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: TEXT.api.requestJson }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: TEXT.api.orders.invalidUpdate }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  if (typeof data.orderId !== "string" || !/^[a-f\d]{24}$/i.test(data.orderId)) {
    return NextResponse.json({ error: TEXT.api.orders.invalidOrderId }, { status: 400 });
  }
  const isPaymentUpdate = typeof data.paymentStatus === "string";
  if (
    isPaymentUpdate
      ? !paymentStatuses.includes(data.paymentStatus as (typeof paymentStatuses)[number])
      : !orderStatuses.includes(data.orderStatus as (typeof orderStatuses)[number])
  ) {
    return NextResponse.json({ error: TEXT.api.orders.invalidStatus }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const order = await Order.findById(data.orderId);
    if (!order) return NextResponse.json({ error: TEXT.api.orders.notFound }, { status: 404 });

    if (isPaymentUpdate) {
      if (order.paymentStatus !== ORDER_STATUSES.paymentPending) {
        return NextResponse.json({ error: TEXT.api.orders.paymentReviewed }, { status: 409 });
      }
      order.paymentStatus = data.paymentStatus as (typeof paymentStatuses)[number];
      if (order.paymentStatus === ORDER_STATUSES.paymentRejected) order.orderStatus = ORDER_STATUSES.rejected;
    } else {
      if (order.paymentStatus !== ORDER_STATUSES.paymentVerified) {
        return NextResponse.json({ error: TEXT.api.orders.verifyPayment }, { status: 409 });
      }
      const allowedNext: Record<string, string> = {
        [ORDER_STATUSES.paymentPending]: ORDER_STATUSES.orderAccepted,
        [ORDER_STATUSES.orderAccepted]: ORDER_STATUSES.preparing,
        [ORDER_STATUSES.preparing]: ORDER_STATUSES.ready,
        [ORDER_STATUSES.ready]: ORDER_STATUSES.completed,
      };
      if (allowedNext[order.orderStatus] !== data.orderStatus) {
        return NextResponse.json({ error: TEXT.api.orders.invalidTransition }, { status: 409 });
      }
      order.orderStatus = data.orderStatus as (typeof orderStatuses)[number];
    }

    await order.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Could not update shopkeeper order:", error);
    return NextResponse.json({ error: TEXT.api.orders.updateFailed }, { status: 500 });
  }
}
