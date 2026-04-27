import mongoose from 'mongoose';

// Unified model - works with both admin and portal customers
const customerSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    contact:  { type: String, trim: true, default: '' },
    email:    { type: String, trim: true, default: '' },
    address:  { type: String, trim: true, default: '' },
    notes:    { type: String, trim: true, default: '' },
    password: { type: String, default: '' },
    phone:    { type: String, default: '' },
  },
  { timestamps: true }
);

export const Customer = mongoose.model('Customer', customerSchema, 'customers');