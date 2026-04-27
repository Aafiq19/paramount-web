import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  quantity:     { type: Number, required: true },
  unit_price:   { type: Number, required: true },
  subtotal:     { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    customer_id:   { type: String, required: true },
    customer_name: { type: String, required: true },
    customer_email:{ type: String, required: true },
    status:        { type: String, enum: ['Pending', 'Approved', 'Completed', 'Cancelled'], default: 'Pending' },
    total_amount:  { type: Number, required: true },
    notes:         { type: String, default: '' },
    items:         [orderItemSchema],
  },
  { timestamps: true }
);

export const Order = mongoose.model('CustomerOrder', orderSchema, 'customer_orders');