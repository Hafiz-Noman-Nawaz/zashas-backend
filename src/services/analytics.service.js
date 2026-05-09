import ActivityLog from "../models/activity-log.model.js";
import Order from "../models/order.model.js";
import { ApiError } from "../utils/api-error.js";

const parseDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new ApiError(400, "Invalid date format");
  }

  return parsed;
};

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const endOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

const resolveRange = (startDate, endDate) => {
  const now = new Date();

  if (startDate && !endDate) {
    const day = startOfDay(parseDate(startDate));
    return { start: day, end: endOfDay(day) };
  }

  if (!startDate && endDate) {
    const day = startOfDay(parseDate(endDate));
    return { start: day, end: endOfDay(day) };
  }

  if (startDate && endDate) {
    const start = startOfDay(parseDate(startDate));
    const end = endOfDay(parseDate(endDate));
    return { start, end };
  }

  const start = new Date(now);
  start.setDate(start.getDate() - 29);

  return { start: startOfDay(start), end: endOfDay(now) };
};

const buildMatch = (range) => ({
  createdAt: { $gte: range.start, $lte: range.end },
  status: { $ne: "cancelled" }
});

const clampLimit = (value, fallback = 5, max = 20) => {
  const parsed = Number(value ?? fallback);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.min(parsed, max);
};

export const getSalesSummary = async ({ startDate, endDate }) => {
  const range = resolveRange(startDate, endDate);
  const match = buildMatch(range);

  const salesCount = await Order.countDocuments(match);

  return { range, salesCount };
};

export const getRevenueSummary = async ({ startDate, endDate }) => {
  const range = resolveRange(startDate, endDate);
  const match = buildMatch(range);

  const revenueAgg = await Order.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
  ]);

  const revenue = revenueAgg[0]?.total || 0;

  return { range, revenue };
};

export const getCustomRangeSummary = async ({ startDate, endDate }) => {
  const range = resolveRange(startDate, endDate);
  const match = buildMatch(range);

  const [salesCount, revenueAgg] = await Promise.all([
    Order.countDocuments(match),
    Order.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ])
  ]);

  const revenue = revenueAgg[0]?.total || 0;

  return { range, salesCount, revenue };
};

export const getTopCategories = async ({ startDate, endDate, limit }) => {
  const range = resolveRange(startDate, endDate);
  const match = buildMatch(range);
  const maxItems = clampLimit(limit, 5, 20);

  const categories = await Order.aggregate([
    { $match: match },
    { $unwind: "$items" },
    { $match: { "items.category": { $ne: "" } } },
    {
      $group: {
        _id: "$items.category",
        revenue: {
          $sum: { $multiply: ["$items.price", "$items.quantity"] }
        },
        units: { $sum: "$items.quantity" }
      }
    },
    { $sort: { revenue: -1 } },
    { $limit: maxItems }
  ]);

  return { range, data: categories };
};

export const getRecentActivity = async ({ startDate, endDate, limit }) => {
  const maxItems = clampLimit(limit, 10, 50);
  const filter = {};

  if (startDate || endDate) {
    const range = resolveRange(startDate, endDate);
    filter.createdAt = { $gte: range.start, $lte: range.end };
  }

  const items = await ActivityLog.find(filter)
    .sort({ createdAt: -1 })
    .limit(maxItems)
    .populate("actor", "name email role");

  return { data: items };
};
