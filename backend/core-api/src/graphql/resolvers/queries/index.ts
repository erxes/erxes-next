import { customerQueries } from './customer';
import { productQueries } from './product';

export default {
  ...customerQueries,
  ...productQueries,
};
