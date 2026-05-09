import Offer from "../models/offer.model.js";
import { ApiError } from "../utils/api-error.js";

const parseDate = (value) => {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new ApiError(400, "Invalid date format");
  }

  return parsed;
};

export const listOffers = async (query) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);
  const filter = {};
  if (query.active === "true") {
    filter.isActive = true;
  }
  if (query.active === "false") {
    filter.isActive = false;
  }

  if (query.search) {
    const regex = new RegExp(query.search, "i");
    filter.$or = [{ title: regex }, { description: regex }];
  }

  const [offers, total] = await Promise.all([
    Offer.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Offer.countDocuments(filter)
  ]);

  return {
    data: offers,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const createOffer = async (payload, userId) => {
  const offer = await Offer.create({
    ...payload,
    startsAt: parseDate(payload.startsAt),
    endsAt: parseDate(payload.endsAt),
    createdBy: userId || undefined
  });

  return offer;
};

export const updateOffer = async (id, payload) => {
  const update = {
    ...payload,
    startsAt: parseDate(payload.startsAt),
    endsAt: parseDate(payload.endsAt)
  };

  const offer = await Offer.findByIdAndUpdate(id, update, { new: true });
  if (!offer) {
    throw new ApiError(404, "Offer not found");
  }

  return offer;
};

export const deleteOffer = async (id) => {
  const offer = await Offer.findByIdAndDelete(id);
  if (!offer) {
    throw new ApiError(404, "Offer not found");
  }

  return offer;
};
