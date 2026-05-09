import { Router } from "express";

import { uploadImage } from "../controllers/upload.controller.js";
import authenticate from "../middlewares/authenticate.js";
import requireRole from "../middlewares/require-role.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.post(
  "/",
  authenticate,
  requireRole("admin", "manager"),
  upload.single("image"),
  uploadImage
);

router.post(
  "/image",
  authenticate,
  requireRole("admin", "manager"),
  upload.single("image"),
  uploadImage
);

export default router;
