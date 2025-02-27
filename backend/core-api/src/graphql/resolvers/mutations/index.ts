import { customerMutations } from './customer';
import { tagMutations } from './tag';

export default {
  ...customerMutations,
  ...tagMutations,
};
