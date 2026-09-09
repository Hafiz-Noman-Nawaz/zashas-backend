import dotenv from "dotenv";

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGODB_URI || "",
  corsOrigin: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(",").map(origin => origin.trim()) 
    : ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "",
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || "15m",
  refreshTokenTtl: process.env.REFRESH_TOKEN_TTL || "7d",
  refreshTokenCookie: process.env.REFRESH_TOKEN_COOKIE || "refreshToken",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
  cloudinaryFolder: process.env.CLOUDINARY_FOLDER || "zasha_collections"
};

if (!env.mongoUri) {
  throw new Error("MONGODB_URI is required");
}

if (!env.jwtAccessSecret || !env.jwtRefreshSecret) {
  throw new Error("JWT secrets are required");
}

export default env;
