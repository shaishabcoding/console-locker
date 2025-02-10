import { Router } from 'express';
import { OrderController } from './Order.controller';

const publicRouter = Router();
const privateRouter = Router();

// create a order
publicRouter.post('/checkout', OrderController.checkout);
publicRouter.post('/:id/cancel', OrderController.cancel);

/**
 * *************************************************************************************************************
 *                                                                                                           *
 *                                           L I N E   B R E A K                                           *
 *                                                                                                           *
 * **************************************************************************************************************
 */

privateRouter.post('/:id/shipped', OrderController.shipped);
privateRouter.get('/', OrderController.retrieve);

export const OrderRoutes = {
  customerRoutes: publicRouter,
  adminRoutes: privateRouter,
};
