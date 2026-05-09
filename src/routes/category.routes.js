import { Router } from "express";

import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory
} from "../controllers/category.controller.js";
import authenticate from "../middlewares/authenticate.js";
import requireRole from "../middlewares/require-role.js";
import validateRequest from "../middlewares/validate-request.js";
import {
  categoryIdSchema,
  createCategorySchema,
  listCategoriesSchema,
  updateCategorySchema
} from "../validators/category.schema.js";

const router = Router();

router.get("/", validateRequest(listCategoriesSchema), listCategories);
router.post(
  "/",
  authenticate,
  requireRole("admin", "manager"),
  validateRequest(createCategorySchema),
  createCategory
);
router.put(
  "/:id",
  authenticate,
  requireRole("admin", "manager"),
  validateRequest(updateCategorySchema),
  updateCategory
);
router.delete(
  "/:id",
  authenticate,
  requireRole("admin"),
  validateRequest(categoryIdSchema),
  deleteCategory
);

export default router;
