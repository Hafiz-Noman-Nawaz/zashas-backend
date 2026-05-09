import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";

const sanitizeUser = (user) => {
  const { passwordHash, _id, ...rest } = user.toObject();
  return { id: _id.toString(), ...rest };
};

export const listUsers = async (query) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);
  const filter = {};

  if (query.search) {
    const regex = new RegExp(query.search, "i");
    filter.$or = [{ name: regex }, { email: regex }, { role: regex }];
  }

  const [items, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(filter)
  ]);

  return {
    data: items.map((user) => sanitizeUser(user)),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return sanitizeUser(user);
};

export const createUser = async (payload) => {
  const email = payload.email.toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, "Email already in use");
  }

  const passwordHash = await bcrypt.hash(payload.password, 12);
  const user = await User.create({
    name: payload.name,
    email,
    passwordHash,
    role: payload.role || "admin",
    isActive: payload.isActive ?? true
  });

  return sanitizeUser(user);
};

export const updateUser = async (id, payload) => {
  const update = { ...payload };

  if (payload.email) {
    update.email = payload.email.toLowerCase();
    const existing = await User.findOne({
      email: update.email,
      _id: { $ne: id }
    });

    if (existing) {
      throw new ApiError(409, "Email already in use");
    }
  }

  if (payload.password) {
    update.passwordHash = await bcrypt.hash(payload.password, 12);
    delete update.password;
  }

  const user = await User.findByIdAndUpdate(id, update, { new: true });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return sanitizeUser(user);
};

export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return sanitizeUser(user);
};
