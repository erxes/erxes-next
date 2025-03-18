import { customerQueries } from './customer';
import { propertyQueries } from './properties';

export default {
  ...customerQueries,
  ...propertyQueries,
};
