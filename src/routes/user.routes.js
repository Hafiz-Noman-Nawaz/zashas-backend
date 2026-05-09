import { Router } from "express";

import {
  createUser,
  deleteUser,
  getUserById,
  listUsers,
  updateUser
} from "../controllers/user.controller.js";
import authenticate from "../middlewares/authenticate.js";
import requireRole from "../middlewares/require-role.js";
import validateRequest from "../middlewares/validate-request.js";
import {
  createUserSchema,
  listUsersSchema,
  updateUserSchema,
  userIdSchema
} from "../validators/user.schema.js";

const router = Router();

router.get(
  "/",
  authenticate,
  requireRole("admin"),
  validateRequest(listUsersSchema),
  listUsers
);
router.get(
  "/:id",
  authenticate,
  requireRole("admin"),
  validateRequest(userIdSchema),
  getUserById
);
router.post(
  "/",
  authenticate,
  requireRole("admin"),
  validateRequest(createUserSchema),
  createUser
);
router.put(
  "/:id",
  authenticate,
  requireRole("admin"),
  validateRequest(updateUserSchema),
  updateUser
);
router.delete(
  "/:id",
  authenticate,
  requireRole("admin"),
  validateRequest(userIdSchema),
  deleteUser
);

export default router;
