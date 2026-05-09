import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema(
  {
    methodId: { type: String, required: true, unique: true }, // e.g., 'nayapay', 'jazzcash'
    name: { type: String, required: true }, // e.g., 'NayaPay'
    accountNumber: { type: String, required: true }, // e.g., '0302-1493236'
    accountTitle: { type: String, required: true }, // e.g., 'Zahida Shahnawaz'
    bankName: { type: String, default: "" }, // Optional
    iban: { type: String, default: "" }, // Optional
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const PaymentMethod = mongoose.model("PaymentMethod", paymentMethodSchema);

export default PaymentMethod;
