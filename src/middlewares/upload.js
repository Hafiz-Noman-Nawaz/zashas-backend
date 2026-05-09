import crypto from "crypto";
import fs from "fs";
import path from "path";
import multer from "multer";

import { ApiError } from "../utils/api-error.js";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const uploadsDir = path.resolve("uploads");

const ensureUploadsDir = () => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadsDir();
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new ApiError(400, "Unsupported image type"));
    }

    return cb(null, true);
  }
});

export default upload;
