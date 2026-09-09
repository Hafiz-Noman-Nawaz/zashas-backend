import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../utils/token.js";

const buildTokens = (user) => {
  const payload = { sub: user.id, role: user.role };

  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload)
  };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !user.isActive) {
    throw new ApiError(401, "Invalid credentials");
  }

  const hash = user.passwordHash || user.password;
  if (!hash) {
    throw new ApiError(401, "Invalid credentials");
  }

  const matches = await bcrypt.compare(password, hash);
  if (!matches) {
    throw new ApiError(401, "Invalid credentials");
  }

  const tokens = buildTokens(user);

  return { user, tokens };
};

export const refreshTokens = async (refreshToken) => {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const tokens = buildTokens(user);
  return { user, tokens };
};

export const getUserById = async (id) => {
  const user = await User.findById(id).select("-passwordHash");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};
