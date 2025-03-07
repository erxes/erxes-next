import { customerQueries } from './customer';
import { tagQueries } from './tag';

export default {
  ...customerQueries,
  ...tagQueries,
};
