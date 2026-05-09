import { ZodError } from "zod";

import { ApiError } from "../utils/api-error.js";

const validateRequest = (schema) => (req, res, next) => {
  try {
    req.validated = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query
    });
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return next(new ApiError(400, "Validation error", err.flatten()));
    }
    next(err);
  }
};

export default validateRequest;
