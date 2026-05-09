import asyncHandler from "../utils/async-handler.js";
import * as activityService from "../services/activity.service.js";
import * as categoryService from "../services/category.service.js";

export const listCategories = asyncHandler(async (req, res) => {
  const { query } = req.validated;
  const result = await categoryService.listCategories(query);

  res.json({ success: true, ...result });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { body } = req.validated;
  const category = await categoryService.createCategory(body);

  await activityService.logActivitySafe({
    action: "category_created",
    entityType: "category",
    entityId: category.id,
    actorId: req.user?.id,
    message: `Category created: ${category.name}`
  });

  res.status(201).json({ success: true, data: category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { params, body } = req.validated;
  const category = await categoryService.updateCategory(params.id, body);

  await activityService.logActivitySafe({
    action: "category_updated",
    entityType: "category",
    entityId: category.id,
    actorId: req.user?.id,
    message: `Category updated: ${category.name}`
  });

  res.json({ success: true, data: category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { params } = req.validated;
  const category = await categoryService.deleteCategory(params.id);

  await activityService.logActivitySafe({
    action: "category_deleted",
    entityType: "category",
    entityId: category.id,
    actorId: req.user?.id,
    message: `Category deleted: ${category.name}`
  });

  res.json({ success: true, data: category });
});
