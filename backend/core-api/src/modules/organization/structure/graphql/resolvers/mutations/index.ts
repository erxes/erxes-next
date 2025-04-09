import { deparmentMutations } from './deparments';
import { branchsMutations } from './branches';
import { positionMutations } from './positions';
import { structuresMutations } from './structure';

export const contactMutations = {
  ...branchsMutations,
  ...positionMutations,
  ...structuresMutations,
  ...deparmentMutations,
};
