import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import { ApiError } from "../utils/api-error.js";
import { sendOrderConfirmationEmail } from "./mail.service.js";

const parseDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new ApiError(400, "Invalid date format");
  }

  return parsed;
};

const resolveRange = (startDate, endDate) => {
  if (!startDate && !endDate) {
    return null;
  }

  const start = startDate ? parseDate(startDate) : null;
  const end = endDate ? parseDate(endDate) : null;

  if (start && end && start > end) {
    throw new ApiError(400, "Start date cannot be after end date");
  }

  return {
    start: start || end,
    end: end || start
  };
};

const buildOrderItems = async (items) => {
  if (!items || items.length === 0) {
    throw new ApiError(400, "Order items are required");
  }

  const productIds = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== productIds.length) {
    throw new ApiError(400, "One or more products are invalid");
  }

  const productMap = new Map(
    products.map((product) => [product.id, product])
  );

  return items.map((item) => {
    const product = productMap.get(item.productId);
    const price =
      product.discountedPrice !== undefined && product.discountedPrice !== null
        ? product.discountedPrice
        : product.price;

    return {
      productId: product.id,
      title: product.title,
      category: product.category,
      selectedVariant: item.selectedVariant || "",
      quantity: item.quantity,
      price
    };
  });
};

const calculateTotal = (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);

export const listOrders = async (query) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.search) {
    const regex = new RegExp(query.search, "i");
    filter.$or = [{ status: regex }, { currency: regex }];
  }

  const range = resolveRange(query.startDate, query.endDate);
  if (range) {
    filter.createdAt = {
      $gte: range.start,
      $lte: range.end
    };
  }

  const [items, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Order.countDocuments(filter)
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

export const getOrderById = async (id) => {
  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  return order;
};

export const createOrder = async (payload, userId) => {
  const items = await buildOrderItems(payload.items);
  const totalAmount = calculateTotal(items);

  const order = await Order.create({
    items,
    totalAmount,
    currency: payload.currency || "PKR",
    status: payload.status || "pending",
    customerDetails: payload.customerDetails,
    paymentDetails: payload.paymentDetails,
    createdBy: userId || undefined
  });

  // Deduct inventory stock for purchased items
  for (const item of items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity }
    }).catch((err) => console.error("Failed to deduct stock for product:", item.productId, err));
  }

  // Fire and forget email confirmation
  sendOrderConfirmationEmail(order).catch(console.error);

  return order;
};

export const updateOrderStatus = async (id, status) => {
  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return order;
};

export const deleteOrder = async (id) => {
  const order = await Order.findByIdAndDelete(id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return order;
};
