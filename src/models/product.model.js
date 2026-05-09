import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subcategory: { type: String, trim: true, default: "" },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    discountedPrice: { type: Number, min: 0 },
    images: { type: [String], default: [] },
    fabric: { type: String, default: "" },
    colors: { type: [String], default: [] },
    stock: { type: Number, default: 0, min: 0 },
    tags: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
