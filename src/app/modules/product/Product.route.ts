import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidation } from './Product.validation';
import { ProductController } from './Product.controller';
import imageUploader from '../../middlewares/imageUploader';

const privateRouter = Router();
const publicRouter = Router();

/** for  admin */
// create a new product
privateRouter.post(
  '/create',
  imageUploader(),
  validateRequest(ProductValidation.create),
  ProductController.create,
);

// update a product
privateRouter.patch(
  '/:productId/edit',
  imageUploader(),
  validateRequest(ProductValidation.update),
  ProductController.update,
);

// delete a product
privateRouter.delete('/:id/delete', ProductController.delete);

// create a new variant
privateRouter.post(
  '/:productId/variant/create',
  imageUploader(),
  validateRequest(ProductValidation.createVariant),
  ProductController.createVariant,
);

/**
 * *************************************************************************************************************
 *                                                                                                           *
 *                                           L I N E   B R E A K                                           *
 *                                                                                                           *
 * **************************************************************************************************************
 */

/** for customer */
// retrieved all products
publicRouter.get('/', ProductController.list);

publicRouter.get('/:productName/find-slug', ProductController.findSlug);

publicRouter.get('/:slug', ProductController.retrieve);

// calculate a product price
publicRouter.get(
  '/:productType/:brand/:productName/price',
  ProductController.calculateProductPrice,
);

export const ProductRoutes = {
  adminProductRoutes: privateRouter,
  customerProductRoutes: publicRouter,
};
