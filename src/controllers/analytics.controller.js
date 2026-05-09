import asyncHandler from "../utils/async-handler.js";
import * as analyticsService from "../services/analytics.service.js";

export const getSalesSummary = asyncHandler(async (req, res) => {
  const { query } = req.validated;
  const result = await analyticsService.getSalesSummary(query);

  res.json({ success: true, data: result });
});

export const getRevenueSummary = asyncHandler(async (req, res) => {
  const { query } = req.validated;
  const result = await analyticsService.getRevenueSummary(query);

  res.json({ success: true, data: result });
});

export const getCustomRangeSummary = asyncHandler(async (req, res) => {
  const { query } = req.validated;
  const result = await analyticsService.getCustomRangeSummary(query);

  res.json({ success: true, data: result });
});

export const getTopCategories = asyncHandler(async (req, res) => {
  const { query } = req.validated;
  const result = await analyticsService.getTopCategories(query);

  res.json({ success: true, data: result });
});

export const getRecentActivity = asyncHandler(async (req, res) => {
  const { query } = req.validated;
  const result = await analyticsService.getRecentActivity(query);

  res.json({ success: true, data: result });
});
