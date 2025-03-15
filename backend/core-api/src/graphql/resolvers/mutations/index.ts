import { customerMutations } from './customer';
import { structuresMutations } from './structure';

export default {
  ...customerMutations,
  ...structuresMutations
};
