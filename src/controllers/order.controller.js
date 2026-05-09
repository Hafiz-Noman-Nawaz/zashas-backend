import asyncHandler from "../utils/async-handler.js";
import * as activityService from "../services/activity.service.js";
import * as orderService from "../services/order.service.js";

export const listOrders = asyncHandler(async (req, res) => {
  const { query } = req.validated;
  const result = await orderService.listOrders(query);

  res.json({ success: true, ...result });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const { params } = req.validated;
  const order = await orderService.getOrderById(params.id);

  res.json({ success: true, data: order });
});

export const createOrder = asyncHandler(async (req, res) => {
  const { body } = req.validated;
  const order = await orderService.createOrder(body, req.user?.id);

  await activityService.logActivitySafe({
    action: "order_created",
    entityType: "order",
    entityId: order.id,
    actorId: req.user?.id,
    message: `Order created: ${order.id}`
  });

  res.status(201).json({ success: true, data: order });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { params, body } = req.validated;
  const order = await orderService.updateOrderStatus(params.id, body.status);

  await activityService.logActivitySafe({
    action: "order_status_updated",
    entityType: "order",
    entityId: order.id,
    actorId: req.user?.id,
    message: `Order status updated: ${order.status}`
  });

  res.json({ success: true, data: order });
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const { params } = req.validated;
  const order = await orderService.deleteOrder(params.id);

  await activityService.logActivitySafe({
    action: "order_deleted",
    entityType: "order",
    entityId: order.id,
    actorId: req.user?.id,
    message: `Order deleted: ${order.id}`
  });

  res.json({ success: true, data: order });
});
