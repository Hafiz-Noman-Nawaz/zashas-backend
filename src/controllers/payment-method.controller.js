import asyncHandler from "../utils/async-handler.js";
import * as paymentMethodService from "../services/payment-method.service.js";

// Public route to list active payment methods
export const getActivePaymentMethods = asyncHandler(async (req, res) => {
  const methods = await paymentMethodService.getPaymentMethods(true);
  res.json({ success: true, data: methods });
});

// Admin routes
export const getAllPaymentMethods = asyncHandler(async (req, res) => {
  const methods = await paymentMethodService.getPaymentMethods(false);
  res.json({ success: true, data: methods });
});

export const createPaymentMethod = asyncHandler(async (req, res) => {
  const { body } = req.validated;
  const method = await paymentMethodService.createPaymentMethod(body);
  res.status(201).json({ success: true, data: method });
});

export const updatePaymentMethod = asyncHandler(async (req, res) => {
  const { params, body } = req.validated;
  const method = await paymentMethodService.updatePaymentMethod(params.id, body);
  res.json({ success: true, data: method });
});

export const deletePaymentMethod = asyncHandler(async (req, res) => {
  const { params } = req.validated;
  const method = await paymentMethodService.deletePaymentMethod(params.id);
  res.json({ success: true, data: method });
});
