import asyncHandler from "../utils/async-handler.js";
import * as uploadService from "../services/upload.service.js";

export const uploadImage = asyncHandler(async (req, res) => {
  const result = await uploadService.uploadImage(req.file);

  res.status(201).json({ success: true, url: result.url, data: result });
});
