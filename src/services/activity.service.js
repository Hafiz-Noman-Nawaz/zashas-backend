import ActivityLog from "../models/activity-log.model.js";

export const logActivity = async ({
  action,
  entityType,
  entityId,
  actorId,
  message,
  metadata
}) =>
  ActivityLog.create({
    action,
    entityType,
    entityId,
    actor: actorId || undefined,
    message,
    metadata
  });

export const logActivitySafe = async (payload) => {
  try {
    await logActivity(payload);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Activity log failed", err);
    }
  }
};
