import { customerQueries } from './customer';
import { structureQueries } from './structure';

export default {
  ...customerQueries,
  ...structureQueries
};
