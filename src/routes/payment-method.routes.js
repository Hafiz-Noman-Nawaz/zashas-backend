import { Router } from "express";

import {
  getActivePaymentMethods,
  getAllPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod
} from "../controllers/payment-method.controller.js";
import authenticate from "../middlewares/authenticate.js";
import requireRole from "../middlewares/require-role.js";
import validateRequest from "../middlewares/validate-request.js";
import {
  createPaymentMethodSchema,
  updatePaymentMethodSchema,
  paymentMethodIdSchema
} from "../validators/payment-method.schema.js";

const router = Router();

// Public route for storefront checkout
router.get("/active", getActivePaymentMethods);

// Admin CMS routes
router.get("/", authenticate, requireRole("admin", "manager"), getAllPaymentMethods);

router.post(
  "/",
  authenticate,
  requireRole("admin", "manager"),
  validateRequest(createPaymentMethodSchema),
  createPaymentMethod
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

export default router;
