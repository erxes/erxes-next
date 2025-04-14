import { branchsMutations } from './branches';
import { positionMutations } from './positions';
import { structuresMutations } from './structure';
import { deparmentMutations } from './deparments';

export const contactMutations = {
  ...branchsMutations,
  ...positionMutations,
  ...structuresMutations,
  ...deparmentMutations,
};
