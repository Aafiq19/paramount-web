import mongoose from 'mongoose';

// This model writes to the SAME customers collection as admin panel
const customerSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, trim: true, default: '' },
    contact:  { type: String, trim: true, default: '' },
    address:  { type: String, trim: true, default: '' },
    notes:    { type: String, trim: true, default: '' },
    // Portal login fields
    password: { type: String, default: '' },
    phone:    { type: String, default: '' },
  },
  { timestamps: true }
);

export const Customer = mongoose.model('Customer', customerSchema, 'customers');