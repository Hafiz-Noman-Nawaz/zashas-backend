import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema(
  {
    methodId: { type: String, required: true, unique: true, trim: true }, // e.g., 'cod', 'jazzcash', 'easypaisa', 'bank_transfer', 'nayapay'
    name: { type: String, required: true, trim: true }, // e.g., 'Cash on Delivery', 'JazzCash', 'Easypaisa'
    type: { 
      type: String, 
      enum: ["manual", "gateway", "cod"], 
      default: "manual" 
    },
    provider: {
      type: String,
      enum: ["cod", "jazzcash", "easypaisa", "bank", "custom"],
      default: "custom"
    },
    accountNumber: { type: String, default: "", trim: true }, // e.g., '0302-1493236' (empty for COD)
    accountTitle: { type: String, default: "", trim: true }, // e.g., 'Zasha Collections'
    bankName: { type: String, default: "", trim: true }, // Optional
    iban: { type: String, default: "", trim: true }, // Optional
    instructions: { type: String, default: "" }, // Custom instructions shown to customer
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const PaymentMethod = mongoose.model("PaymentMethod", paymentMethodSchema);

export default PaymentMethod;
