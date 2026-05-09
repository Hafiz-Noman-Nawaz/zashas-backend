import fs from "fs/promises";

import cloudinary from "../config/cloudinary.js";
import env from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

const ensureCloudinaryConfigured = () => {
  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
    throw new ApiError(500, "Cloudinary is not configured");
  }
};

export const uploadImage = async (file) => {
  if (!file) {
    throw new ApiError(400, "Image file is required");
  }

  ensureCloudinaryConfigured();

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: env.cloudinaryFolder,
      resource_type: "image"
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    };
  } finally {
    if (file.path) {
      await fs.unlink(file.path).catch(() => undefined);
    }
  }
};
