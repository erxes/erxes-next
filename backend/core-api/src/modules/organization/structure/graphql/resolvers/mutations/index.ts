import { branchsMutations } from './branchs';
import { positionMutations } from './Positions';
import { structuresMutations } from './Structure';
import { deparmentMutations } from './deparments';

export const contactMutations = {
  ...branchsMutations,
  ...positionMutations,
  ...structuresMutations,
  ...deparmentMutations,
};
