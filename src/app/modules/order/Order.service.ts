import { Request } from 'express';
import { Order } from './Order.model';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import Product from '../product/Product.model';
import { Types } from 'mongoose';

export const OrderService = {
  async checkout(req: Request) {
    const { productDetails, customer } = req.body;

    if (
      !productDetails ||
      !Array.isArray(productDetails) ||
      productDetails.length === 0
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Product details are required',
      );
    }

    // Fetch product details and stock availability
    const productDocs = await Product.find({
      _id: { $in: productDetails.map(p => new Types.ObjectId(p.product)) },
    }).select('_id name quantity price offer_price');

    if (productDocs.length === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'No valid products found');
    }

    // Validate stock and calculate total price
    let totalPrice = 0;
    const validProducts = [];

    for (const item of productDetails) {
      const product = productDocs.find(p => p._id.toString() === item.product);
      if (!product) continue; // Skip if product not found

      if (product.quantity < item.quantity) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Insufficient stock for product ${product.name}`,
        );
      }

      const finalPrice = product.offer_price || product.price;

      validProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: finalPrice,
        name: product.name,
      });

      totalPrice += finalPrice * item.quantity;
    }

    if (validProducts.length === 0) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'No valid products available for order',
      );
    }

    const existingOrder = await Order.findOne({
      customer: new Types.ObjectId(customer),
      state: 'pending',
    });

    if (existingOrder) {
      return {
        amount: existingOrder.amount,
        orderId: existingOrder._id,
      };
    }

    // Create a new order if no existing one is found
    const newOrder = await Order.create({
      productDetails: validProducts,
      customer,
      amount: totalPrice,
    });

    return { amount: totalPrice, orderId: newOrder._id };
  },

  async cancel(orderId: string) {
    await Order.findByIdAndUpdate(orderId, {
      state: 'cancel',
    });
  },

  async shipped(orderId: string) {
    await Order.findByIdAndUpdate(orderId, {
      state: 'shipped',
    });
  },

  async retrieve(query: Record<any, any>) {
    const { page = '1', limit = '10', state } = query;
    const filters: Record<string, any> = {};

    if (state) {
      filters.state = state;
    }

    const orders = await Order.find(filters)
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .populate('customer', 'name')
      .populate('productDetails.product', 'name images')
      .populate('transaction', 'transaction_id');

    const totalOrders = await Order.countDocuments(filters);

    return {
      meta: {
        totalPages: Math.ceil(totalOrders / +limit),
        page: +page,
        limit: +limit,
        total: totalOrders,
      },
      orders,
    };
  },
};
