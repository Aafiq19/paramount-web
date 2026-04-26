import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema(
  {
    product:       { type: String, default: '' },
    supplier:      { type: String, default: '' },
    stockQuantity: { type: Number, default: 0 },
    reorderLevel:  { type: Number, default: 0 },
    price:         { type: Number, default: 0 },
    imageUrl:      { type: String, default: '' },
  },
  { timestamps: true }
);

export const Stock = mongoose.model('Stock', stockSchema, 'stocks');