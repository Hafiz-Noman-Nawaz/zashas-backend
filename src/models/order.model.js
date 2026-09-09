import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    title: { type: String, required: true },
    category: { type: String, default: "" },
    selectedVariant: { type: String, default: "" },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

  const orderSchema = new mongoose.Schema(
  {
    items: { type: [orderItemSchema], default: [] },
    totalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "PKR" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    customerDetails: {
      fullName: { type: String, required: true },
      email: { type: String, default: "" },
      phone: { type: String, required: true },
      whatsapp: { type: String, default: "" },
      address: { type: String, required: true },
      city: { type: String, required: true },
      province: { type: String, default: "" },
      postalCode: { type: String, default: "" },
      notes: { type: String, default: "" }
    },
    paymentDetails: {
      method: { type: String, required: true },
      isVerified: { type: Boolean, default: false },
      transactionId: { type: String, default: "" },
      verifiedAt: { type: Date }
    },
    status: {
      type: String,
      enum: ["pending", "processing", "paid", "shipped", "delivered", "cancelled"],
      default: "pending"
    },
    courierDetails: {
      courierName: { type: String, default: "" }, // e.g. 'Trax', 'TCS', 'Leopards', 'PostEx'
      trackingNumber: { type: String, default: "" },
      trackingUrl: { type: String, default: "" },
      dispatchedAt: { type: Date }
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
