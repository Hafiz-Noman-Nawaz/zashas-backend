import asyncHandler from "../utils/async-handler.js";
import * as activityService from "../services/activity.service.js";
import * as productService from "../services/product.service.js";

export const listProducts = asyncHandler(async (req, res) => {
  const { query } = req.validated;
  const result = await productService.listProducts(query);

  res.json({ success: true, ...result });
});

export const getProductById = asyncHandler(async (req, res) => {
  const { params } = req.validated;
  const product = await productService.getProductById(params.id);

  res.json({ success: true, data: product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const { body } = req.validated;
  const product = await productService.createProduct(body);

  await activityService.logActivitySafe({
    action: "product_created",
    entityType: "product",
    entityId: product.id,
    actorId: req.user?.id,
    message: `Product created: ${product.title}`
  });

  res.status(201).json({ success: true, data: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { params, body } = req.validated;
  const product = await productService.updateProduct(params.id, body);

  await activityService.logActivitySafe({
    action: "product_updated",
    entityType: "product",
    entityId: product.id,
    actorId: req.user?.id,
    message: `Product updated: ${product.title}`
  });

  res.json({ success: true, data: product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { params } = req.validated;
  const product = await productService.deleteProduct(params.id);

  await activityService.logActivitySafe({
    action: "product_deleted",
    entityType: "product",
    entityId: product.id,
    actorId: req.user?.id,
    message: `Product deleted: ${product.title}`
  });

  res.json({ success: true, data: product });
});
