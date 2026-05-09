import { Router } from "express";

import analyticsRoutes from "./analytics.routes.js";
import authRoutes from "./auth.routes.js";
import categoryRoutes from "./category.routes.js";
import healthRoutes from "./health.routes.js";
import orderRoutes from "./order.routes.js";
import offerRoutes from "./offer.routes.js";
import productRoutes from "./product.routes.js";
import uploadRoutes from "./upload.routes.js";
import userRoutes from "./user.routes.js";
import paymentMethodRoutes from "./payment-method.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/health", healthRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);
router.use("/offers", offerRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/upload", uploadRoutes);
router.use("/users", userRoutes);
router.use("/payment-methods", paymentMethodRoutes);

export default router;
