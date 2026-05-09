import PaymentMethod from "../models/payment-method.model.js";
import { ApiError } from "../utils/api-error.js";

export const getPaymentMethods = async (publicOnly = false) => {
  const query = publicOnly ? { isActive: true } : {};
  const methods = await PaymentMethod.find(query).sort({ createdAt: -1 });
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

export const deletePaymentMethod = async (id) => {
  const method = await PaymentMethod.findByIdAndDelete(id);
  if (!method) {
    throw new ApiError(404, "Payment method not found");
  }
  return method;
};
