import { Router } from "express";

import {
  getMe,
  login,
  logout,
  refreshToken
} from "../controllers/auth.controller.js";
import authenticate from "../middlewares/authenticate.js";
import validateRequest from "../middlewares/validate-request.js";
import { loginSchema, refreshSchema } from "../validators/auth.schema.js";

const router = Router();

router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh-token", validateRequest(refreshSchema), refreshToken);
router.get("/me", authenticate, getMe);

export default router;
