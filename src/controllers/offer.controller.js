import asyncHandler from "../utils/async-handler.js";
import * as activityService from "../services/activity.service.js";
import * as offerService from "../services/offer.service.js";

export const listOffers = asyncHandler(async (req, res) => {
  const { query } = req.validated;
  const result = await offerService.listOffers(query);

  res.json({ success: true, ...result });
});

export const createOffer = asyncHandler(async (req, res) => {
  const { body } = req.validated;
  const offer = await offerService.createOffer(body, req.user?.id);

  await activityService.logActivitySafe({
    action: "offer_created",
    entityType: "offer",
    entityId: offer.id,
    actorId: req.user?.id,
    message: `Offer created: ${offer.title}`
  });

  res.status(201).json({ success: true, data: offer });
});

export const updateOffer = asyncHandler(async (req, res) => {
  const { params, body } = req.validated;
  const offer = await offerService.updateOffer(params.id, body);

  await activityService.logActivitySafe({
    action: "offer_updated",
    entityType: "offer",
    entityId: offer.id,
    actorId: req.user?.id,
    message: `Offer updated: ${offer.title}`
  });

  res.json({ success: true, data: offer });
});

export const deleteOffer = asyncHandler(async (req, res) => {
  const { params } = req.validated;
  const offer = await offerService.deleteOffer(params.id);

  await activityService.logActivitySafe({
    action: "offer_deleted",
    entityType: "offer",
    entityId: offer.id,
    actorId: req.user?.id,
    message: `Offer deleted: ${offer.title}`
  });

  res.json({ success: true, data: offer });
});
