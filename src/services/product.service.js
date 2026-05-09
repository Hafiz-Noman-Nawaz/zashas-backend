import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import { ApiError } from "../utils/api-error.js";

export const listProducts = async (query) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 12);

  const filter = {};
  if (query.includeHidden !== "true") {
    filter.isVisible = true;
  }
  if (query.category) {
    filter.category = query.category;
  }
  if (query.categoryId) {
    filter.categoryId = query.categoryId;
  }
  if (query.isFeatured) {
    filter.isFeatured = query.isFeatured === "true";
  }
  if (query.isOnSale) {
    filter.isOnSale = query.isOnSale === "true";
  }
  if (query.isNewArrival) {
    filter.isNewArrival = query.isNewArrival === "true";
  }
  if (query.isVisible) {
    filter.isVisible = query.isVisible === "true";
  }
  if (query.tags) {
    const tags = query.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    if (tags.length > 0) {
      filter.tags = { $in: tags };
    }
  }
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter.price = {};
    if (query.minPrice !== undefined) {
      filter.price.$gte = Number(query.minPrice);
    }
    if (query.maxPrice !== undefined) {
      filter.price.$lte = Number(query.maxPrice);
    }
  }
  if (query.search) {
    const regex = new RegExp(query.search, "i");
    filter.$or = [
      { title: regex },
      { description: regex },
      { tags: regex }
    ];
  }

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    featured: { isFeatured: -1, createdAt: -1 }
  };
  const sort = sortMap[query.sort] || { createdAt: -1 };

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(filter)
  ]);

  return {
    data: items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

const resolveCategoryPayload = async (payload) => {
  if (!payload.categoryId) {
    return payload;
  }

  const category = await Category.findById(payload.categoryId);
  if (!category) {
    throw new ApiError(400, "Invalid category");
  }

  return {
    ...payload,
    category: payload.category || category.name
  };
};

export const createProduct = async (payload) => {
  const resolvedPayload = await resolveCategoryPayload(payload);
  const product = await Product.create(resolvedPayload);
  return product;
};

export const updateProduct = async (id, payload) => {
  const resolvedPayload = await resolveCategoryPayload(payload);
  const product = await Product.findByIdAndUpdate(id, resolvedPayload, {
    new: true,
    runValidators: true
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};

export const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
};
