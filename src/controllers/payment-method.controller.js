import asyncHandler from "../utils/async-handler.js";
import * as paymentMethodService from "../services/payment-method.service.js";
import * as paymentGatewayService from "../services/payment-gateway.service.js";

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

export const togglePaymentMethod = asyncHandler(async (req, res) => {
  const { params, body } = req.validated;
  const isActive = body?.isActive;
  const method = await paymentMethodService.togglePaymentMethodStatus(params.id, isActive);
  res.json({ success: true, data: method });
});

export const deletePaymentMethod = asyncHandler(async (req, res) => {
  const { params } = req.validated;
  const method = await paymentMethodService.deletePaymentMethod(params.id);
  res.json({ success: true, data: method });
});

// Gateway Status (Admin safe check)
export const getGatewayStatus = asyncHandler(async (req, res) => {
  const status = paymentGatewayService.getGatewayStatus();
  res.json({ success: true, data: status });
});

// Verify payment (Gateway webhook or manual admin verification)
export const verifyPayment = asyncHandler(async (req, res) => {
  const { body } = req.validated;
  const order = await paymentGatewayService.verifyPayment(body);
  res.json({ success: true, data: order, message: "Payment verified successfully" });
});
