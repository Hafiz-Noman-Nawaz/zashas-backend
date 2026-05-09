import asyncHandler from "../utils/async-handler.js";
import * as activityService from "../services/activity.service.js";
import * as userService from "../services/user.service.js";

export const listUsers = asyncHandler(async (req, res) => {
  const { query } = req.validated;
  const result = await userService.listUsers(query);

  res.json({ success: true, ...result });
});

export const getUserById = asyncHandler(async (req, res) => {
  const { params } = req.validated;
  const user = await userService.getUserById(params.id);

  res.json({ success: true, data: user });
});

export const createUser = asyncHandler(async (req, res) => {
  const { body } = req.validated;
  const user = await userService.createUser(body);

  await activityService.logActivitySafe({
    action: "user_created",
    entityType: "user",
    entityId: user.id,
    actorId: req.user?.id,
    message: `User created: ${user.email}`
  });

  res.status(201).json({ success: true, data: user });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { params, body } = req.validated;
  const user = await userService.updateUser(params.id, body);

  await activityService.logActivitySafe({
    action: "user_updated",
    entityType: "user",
    entityId: user.id,
    actorId: req.user?.id,
    message: `User updated: ${user.email}`
  });

  res.json({ success: true, data: user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { params } = req.validated;
  const user = await userService.deleteUser(params.id);

  await activityService.logActivitySafe({
    action: "user_deleted",
    entityType: "user",
    entityId: user.id,
    actorId: req.user?.id,
    message: `User deleted: ${user.email}`
  });

  res.json({ success: true, data: user });
});
