import mongoose from 'mongoose';

// Matches the existing 'orders' collection in Atlas
const orderSchema = new mongoose.Schema(
  {
    customer_id:   { type: String, default: '' },
    customer_name: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    total_amount: { type: Number, required: true },
    notes:        { type: String, default: '' },
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema, 'orders');