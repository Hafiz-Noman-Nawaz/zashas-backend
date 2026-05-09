import env from "../config/env.js";
import asyncHandler from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import * as authService from "../services/auth.service.js";

const mapUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role
});

const setRefreshCookie = (res, token) => {
  const isProduction = env.nodeEnv === "production";

  res.cookie(env.refreshTokenCookie, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/api/auth/refresh-token"
  });
};

export const login = asyncHandler(async (req, res) => {
  const { body } = req.validated;
  const { user, tokens } = await authService.login(body);

  setRefreshCookie(res, tokens.refreshToken);

  res.json({
    success: true,
    data: {
      user: mapUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    }
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(env.refreshTokenCookie, { path: "/api/auth/refresh-token" });
  res.json({ success: true });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const tokenFromCookie = req.cookies?.[env.refreshTokenCookie];
  const tokenFromBody = req.validated.body.refreshToken;
  const refreshTokenValue = tokenFromCookie || tokenFromBody;

  if (!refreshTokenValue) {
    throw new ApiError(401, "Refresh token required");
  }

  const { user, tokens } = await authService.refreshTokens(refreshTokenValue);

  setRefreshCookie(res, tokens.refreshToken);

  res.json({
    success: true,
    data: {
      user: mapUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    }
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user.id);

  res.json({
    success: true,
    data: mapUser(user)
  });
});
