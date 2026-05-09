import { Router } from "express";

import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct
} from "../controllers/product.controller.js";
import authenticate from "../middlewares/authenticate.js";
import requireRole from "../middlewares/require-role.js";
import validateRequest from "../middlewares/validate-request.js";
import {
  createProductSchema,
  listProductsSchema,
  productIdSchema,
  updateProductSchema
} from "../validators/product.schema.js";

const router = Router();

router.get("/", validateRequest(listProductsSchema), listProducts);
router.get("/:id", validateRequest(productIdSchema), getProductById);
router.post(
  "/",
  authenticate,
  requireRole("admin", "manager"),
  validateRequest(createProductSchema),
  createProduct
);
router.put(
  "/:id",
  authenticate,
  requireRole("admin", "manager"),
  validateRequest(updateProductSchema),
  updateProduct
);
router.delete(
  "/:id",
  authenticate,
  requireRole("admin"),
  validateRequest(productIdSchema),
  deleteProduct
);

export default router;
