import { customerMutations } from './customer';
import { formMutations } from './form';

export default {
  ...customerMutations,
  ...formMutations,
};
