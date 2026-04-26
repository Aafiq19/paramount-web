import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    product:       { type: String, required: true },
    supplier:      { type: String, required: true },
    stockQuantity: { type: Number, required: true },
    reorderLevel:  { type: Number, required: true },
    price:         { type: Number, default: 0 },
    imageUrl:      { type: String, default: '' },
  },
  { timestamps: true }
);

export const Stock = mongoose.model("Stock", stockSchema);