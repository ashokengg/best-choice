import mongoose, { Schema } from "mongoose";

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
    paymentMethod: { type: String, enum: ["UPI"], default: "UPI" },
    screenshot: { type: Buffer, required: true, select: false },
    screenshotContentType: { type: String, required: true, select: false },
    transactionId: { type: String, required: true, trim: true },
    paymentStatus: {
      type: String,
      enum: ["Payment Verification Pending", "Payment Verified", "Payment Rejected"],
      default: "Payment Verification Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Payment Verification Pending", "Order Accepted", "Preparing", "Ready", "Completed", "Rejected"],
      default: "Payment Verification Pending",
    },
  },
  { timestamps: true },
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
