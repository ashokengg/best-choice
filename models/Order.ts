import mongoose, { Schema } from "mongoose";
import { ORDER_STATUSES, TEXT } from "@/app/constants";

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    customerName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    items: {
      type: [
        {
          slug: { type: String, required: true },
          title: { type: String, required: true },
          price: { type: Number, required: true },
          quantity: { type: Number, required: true },
          img: { type: String, required: true },
        },
      ],
      required: true,
    },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: [TEXT.checkout.paymentMethod], default: TEXT.checkout.paymentMethod },
    screenshot: { type: Buffer, required: true, select: false },
    screenshotContentType: { type: String, required: true, select: false },
    transactionId: { type: String, required: true, trim: true },
    paymentStatus: {
      type: String,
      enum: [ORDER_STATUSES.paymentPending, ORDER_STATUSES.paymentVerified, ORDER_STATUSES.paymentRejected],
      default: ORDER_STATUSES.paymentPending,
    },
    orderStatus: {
      type: String,
      enum: [
        ORDER_STATUSES.paymentPending,
        ORDER_STATUSES.orderAccepted,
        ORDER_STATUSES.preparing,
        ORDER_STATUSES.ready,
        ORDER_STATUSES.completed,
        ORDER_STATUSES.rejected,
      ],
      default: ORDER_STATUSES.paymentPending,
    },
  },
  { timestamps: true },
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
