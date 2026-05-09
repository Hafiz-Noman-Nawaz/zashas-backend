import { Router } from "express";

import {
  createOrder,
  deleteOrder,
  getOrderById,
  listOrders,
  updateOrderStatus
} from "../controllers/order.controller.js";
import authenticate from "../middlewares/authenticate.js";
import requireRole from "../middlewares/require-role.js";
import validateRequest from "../middlewares/validate-request.js";
import {
  createOrderSchema,
  listOrdersSchema,
  orderIdSchema,
  updateOrderStatusSchema
} from "../validators/order.schema.js";

const router = Router();

router.get(
  "/",
  authenticate,
  requireRole("admin", "manager"),
  validateRequest(listOrdersSchema),
  listOrders
);
router.get(
  "/:id",
  authenticate,
  requireRole("admin", "manager"),
  validateRequest(orderIdSchema),
  getOrderById
);
router.post(
  "/",
  validateRequest(createOrderSchema),
  createOrder
);
router.put(
  "/:id/status",
  authenticate,
  requireRole("admin", "manager"),
  validateRequest(updateOrderStatusSchema),
  updateOrderStatus
);
router.delete(
  "/:id",
  authenticate,
  requireRole("admin"),
  validateRequest(orderIdSchema),
  deleteOrder
);

export default router;
