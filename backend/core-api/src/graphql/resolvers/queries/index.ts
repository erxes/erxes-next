import { customerQueries } from './customer';
import { formQueries } from './form';

export default {
  ...customerQueries,
  ...formQueries,
};
