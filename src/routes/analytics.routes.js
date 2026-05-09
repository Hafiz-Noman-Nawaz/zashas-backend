import { Router } from "express";

import {
  getCustomRangeSummary,
  getRecentActivity,
  getRevenueSummary,
  getSalesSummary,
  getTopCategories
} from "../controllers/analytics.controller.js";
import authenticate from "../middlewares/authenticate.js";
import requireRole from "../middlewares/require-role.js";
import validateRequest from "../middlewares/validate-request.js";
import { analyticsQuerySchema } from "../validators/analytics.schema.js";

const router = Router();

router.get(
  "/sales",
  authenticate,
  requireRole("admin", "manager"),
  validateRequest(analyticsQuerySchema),
  getSalesSummary
);

router.get(
  "/revenue",
  authenticate,
  requireRole("admin", "manager"),
  validateRequest(analyticsQuerySchema),
  getRevenueSummary
);

router.get(
  "/custom-range",
  authenticate,
  requireRole("admin", "manager"),
  validateRequest(analyticsQuerySchema),
  getCustomRangeSummary
);

router.get(
  "/top-categories",
  authenticate,
  requireRole("admin", "manager"),
  validateRequest(analyticsQuerySchema),
  getTopCategories
);

router.get(
  "/activity",
  authenticate,
  requireRole("admin", "manager"),
  validateRequest(analyticsQuerySchema),
  getRecentActivity
);

export default router;
