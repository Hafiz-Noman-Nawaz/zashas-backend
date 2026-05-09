import Category from "../models/category.model.js";
import { ApiError } from "../utils/api-error.js";
import slugify from "../utils/slugify.js";

export const listCategories = async (query) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);
  const includeHidden = query.includeHidden === "true";
  const filter = includeHidden ? {} : { isVisible: true };

  if (query.search) {
    const regex = new RegExp(query.search, "i");
    filter.$or = [{ name: regex }, { description: regex }];
  }

  const [items, total] = await Promise.all([
    Category.find(filter)
      .sort({ sortOrder: 1, name: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Category.countDocuments(filter)
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

export const createCategory = async (payload) => {
  const slug = payload.slug ? slugify(payload.slug) : slugify(payload.name);
  const existing = await Category.findOne({ slug });

  if (existing) {
    throw new ApiError(409, "Category slug already exists");
  }

  const category = await Category.create({ ...payload, slug });
  return category;
};

export const updateCategory = async (id, payload) => {
  const update = { ...payload };

  if (payload.name && !payload.slug) {
    update.slug = slugify(payload.name);
  }

  if (payload.slug) {
    update.slug = slugify(payload.slug);
  }

  if (update.slug) {
    const existing = await Category.findOne({
      slug: update.slug,
      _id: { $ne: id }
    });

    if (existing) {
      throw new ApiError(409, "Category slug already exists");
    }
  }

  const category = await Category.findByIdAndUpdate(id, update, {
    new: true
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};

export const deleteCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};
