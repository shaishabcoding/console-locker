import { model, Schema } from 'mongoose';
import { TAddress, TCustomer } from './Customer.interface';

export const addressSchema = new Schema<TAddress>({
  address: {
    type: String,
    required: true,
    trim: true,
  },
  zip_code: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
});

const customerSchema = new Schema<TCustomer>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    address: {
      type: addressSchema,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: '/images/placeholder.png',
    },
  },
  {
    timestamps: true,
  },
);

export const Customer = model('Customer', customerSchema);
