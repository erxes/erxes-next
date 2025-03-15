import { customerMutations } from './customer';
import { internalNoteMutations } from './internalNote';

export default {
  ...customerMutations,
  ...internalNoteMutations,
};
