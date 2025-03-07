import { productConfigQueries as configs } from './config';
import { productQueries as products } from './product';

export const productQueries = {
  ...products,
  ...configs,
};
