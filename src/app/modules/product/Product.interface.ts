import { Types } from 'mongoose';

export type TProduct = {
  _id?: Types.ObjectId;
  slug: string;
  admin: Types.ObjectId;
  images: string[];
  name: string;
  description?: string;
  price: number;
  offer_price?: number;
  brand?: string;
  model?: string;
  condition: string;
  controller?: string;
  memory?: string;
  quantity: number;
  isVariant: boolean;
  product_type?: string;
  product_ref?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  ratings?: number;
  reviewCount?: number;
};
