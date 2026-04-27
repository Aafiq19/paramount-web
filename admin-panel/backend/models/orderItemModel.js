import mongoose from 'mongoose';

// Matches the existing 'orderitems' collection in Atlas
const orderItemSchema = new mongoose.Schema(
  {
    order_id:     { type: String, required: true },
    product_id:   { type: String, default: '' },
    product_name: { type: String, required: true },
    quantity:     { type: Number, required: true },
    unit_price:   { type: Number, required: true },
  },
  { timestamps: true }
);

export const OrderItem = mongoose.model('OrderItem', orderItemSchema, 'orderitems');