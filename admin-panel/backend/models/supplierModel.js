import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
  {
    supplierName: {
      type: String,
      required: [true, 'Supplier name is required'],
      trim: true,
    },
    contact: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    productsSupplied: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

export const Supplier = mongoose.model('Supplier', supplierSchema);