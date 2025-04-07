import { branchsMutations } from './branchs';
import { deparmentMutations } from './deparments';
import { positionMutations } from './positions';
import { structuresMutations } from './structure';

export const contactMutations = {
  ...branchsMutations,
  ...positionMutations,
  ...structuresMutations,
  ...deparmentMutations,
};
