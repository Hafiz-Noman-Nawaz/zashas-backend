import { Router } from "express";

import {
  createOffer,
  deleteOffer,
  listOffers,
  updateOffer
} from "../controllers/offer.controller.js";
import authenticate from "../middlewares/authenticate.js";
import requireRole from "../middlewares/require-role.js";
import validateRequest from "../middlewares/validate-request.js";
import {
  createOfferSchema,
  listOffersSchema,
  offerIdSchema,
  updateOfferSchema
} from "../validators/offer.schema.js";

const router = Router();

router.get("/", validateRequest(listOffersSchema), listOffers);
router.post(
  "/",
  authenticate,
  requireRole("admin", "manager"),
  validateRequest(createOfferSchema),
  createOffer
);
router.put(
  "/:id",
  authenticate,
  requireRole("admin", "manager"),
  validateRequest(updateOfferSchema),
  updateOffer
);
router.delete(
  "/:id",
  authenticate,
  requireRole("admin"),
  validateRequest(offerIdSchema),
  deleteOffer
);

export default router;
