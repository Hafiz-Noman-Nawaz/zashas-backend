import { Router } from "express";

import {
  getActivePaymentMethods,
  getAllPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  togglePaymentMethod,
  deletePaymentMethod,
  getGatewayStatus,
  verifyPayment
} from "../controllers/payment-method.controller.js";
import authenticate from "../middlewares/authenticate.js";
import requireRole from "../middlewares/require-role.js";
import validateRequest from "../middlewares/validate-request.js";
import {
  createPaymentMethodSchema,
  updatePaymentMethodSchema,
  paymentMethodIdSchema,
  togglePaymentMethodSchema,
  verifyPaymentSchema
} from "../validators/payment-method.schema.js";

const router = Router();

// Public route for storefront checkout
router.get("/active", getActivePaymentMethods);

// Admin CMS routes
router.get("/gateways/status", authenticate, requireRole("admin", "manager"), getGatewayStatus);

router.get("/", authenticate, requireRole("admin", "manager"), getAllPaymentMethods);

router.post(
  "/",
  authenticate,
  requireRole("admin", "manager"),
  validateRequest(createPaymentMethodSchema),
  createPaymentMethod
);

router.patch(
  "/:id/toggle",
  authenticate,
  requireRole("admin", "manager"),
  validateRequest(togglePaymentMethodSchema),
  togglePaymentMethod
);

router.put(
  "/:id",
  authenticate,
  requireRole("admin", "manager"),
  validateRequest(updatePaymentMethodSchema),
  updatePaymentMethod
);

router.delete(
  "/:id",
  authenticate,
  requireRole("admin", "manager"),
  validateRequest(paymentMethodIdSchema),
  deletePaymentMethod
);

// Payment verification endpoint (gateway webhook or admin authorization)
router.post(
  "/verify",
  authenticate,
  requireRole("admin", "manager"),
  validateRequest(verifyPaymentSchema),
  verifyPayment
);

export default router;
