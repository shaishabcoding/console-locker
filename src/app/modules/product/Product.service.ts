import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { TProduct } from './Product.interface';
import Product from './Product.model';

export const ProductService = {
  async createProduct(newProduct: TProduct) {
    return await Product.create(newProduct);
  },

  async updateProduct(productId: string, updateData: Partial<TProduct>) {
    return await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true,
    }).select('-variants');
  },

  async updateVariant(
    productId: string,
    variantId: string,
    variantData: Partial<TProduct>,
  ) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
    }

    const variant = product.variants?.find(
      v => v._id!.toString() === variantId,
    );

    if (!variant) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Variant not found');
    }

    // Update the variant's fields
    Object.assign(variant, variantData);

    await product.save();
    return variant;
  },
};
