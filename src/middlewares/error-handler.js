import { ApiError } from "../utils/api-error.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";
  const details = err instanceof ApiError ? err.details : undefined;

  if (req.app.get("env") !== "production") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {})
  });
};

export default errorHandler;
