import PaymentMethod from "../models/payment-method.model.js";
import { ApiError } from "../utils/api-error.js";

// Seed default Pakistani payment methods if collection is completely empty
const DEFAULT_METHODS = [
  {
    methodId: "cod",
    name: "Cash on Delivery",
    type: "cod",
    provider: "cod",
    accountNumber: "",
    accountTitle: "",
    instructions: "Pay with cash directly to the rider upon delivery at your doorstep.",
    isActive: true
  },
  {
    methodId: "jazzcash",
    name: "JazzCash",
    type: "manual",
    provider: "jazzcash",
    accountNumber: "0300-1234567",
    accountTitle: "Zashas Collection",
    instructions: "Transfer to JazzCash mobile wallet and share payment confirmation screenshot on WhatsApp.",
    isActive: true
  },
  {
    methodId: "easypaisa",
    name: "Easypaisa",
    type: "manual",
    provider: "easypaisa",
    accountNumber: "0345-1234567",
    accountTitle: "Zashas Collection",
    instructions: "Transfer to Easypaisa mobile account and share transaction SMS/screenshot on WhatsApp.",
    isActive: true
  },
  {
    methodId: "bank_transfer",
    name: "Direct Bank Transfer",
    type: "manual",
    provider: "bank",
    bankName: "Meezan Bank Ltd",
    accountNumber: "0102-0103456789",
    accountTitle: "Zashas Official",
    iban: "PK00MEZN0001020103456789",
    instructions: "Transfer to our bank account via online banking/ATM and share receipt on WhatsApp.",
    isActive: true
  }
];

export const seedDefaultPaymentMethodsIfNeeded = async () => {
  const count = await PaymentMethod.countDocuments();
  if (count === 0) {
    await PaymentMethod.insertMany(DEFAULT_METHODS);
  }
};

export const getPaymentMethods = async (publicOnly = false) => {
  await seedDefaultPaymentMethodsIfNeeded();

  const query = publicOnly ? { isActive: true } : {};
  let methods = await PaymentMethod.find(query).sort({ createdAt: -1 }).lean();

  if (publicOnly) {
    // Check if any gateway providers are active
    const activeGatewayProviders = new Set(
      methods
        .filter((m) => m.type === "gateway" && m.provider && m.provider !== "custom")
        .map((m) => m.provider)
    );

    // Rule 3: Automatic replacement:
    // If JazzCash or Easypaisa gateway is active, automatically remove/hide the corresponding manual payment option
    methods = methods.filter((m) => {
      if (m.type === "manual" && activeGatewayProviders.has(m.provider)) {
        return false;
      }
      return true;
    });

    // Deduplicate methods: ensure no duplicate methodId or redundant provider options are presented
    const seen = new Set();
    methods = methods.filter((m) => {
      const key = m.methodId || `${m.provider}-${m.type}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  return methods;
};

export const createPaymentMethod = async (payload) => {
  const exists = await PaymentMethod.findOne({ methodId: payload.methodId });
  if (exists) {
    throw new ApiError(400, "Payment method ID already exists");
  }
  const method = await PaymentMethod.create(payload);
  return method;
};

export const updatePaymentMethod = async (id, payload) => {
  const method = await PaymentMethod.findByIdAndUpdate(id, payload, { new: true });
  if (!method) {
    throw new ApiError(404, "Payment method not found");
  }
  return method;
};

export const togglePaymentMethodStatus = async (id, forceIsActive) => {
  const method = await PaymentMethod.findById(id);
  if (!method) {
    throw new ApiError(404, "Payment method not found");
  }
  method.isActive = forceIsActive !== undefined ? Boolean(forceIsActive) : !method.isActive;
  await method.save();
  return method;
};

export const deletePaymentMethod = async (id) => {
  const method = await PaymentMethod.findByIdAndDelete(id);
  if (!method) {
    throw new ApiError(404, "Payment method not found");
  }
  return method;
};
