import { branchsQueries } from './branchs';
import { positionQueries } from './Positions';
import { structuresQueries } from './Structure';
import { deparmentQueries } from './deparments';

export const contactMutations = {
  ...branchsQueries,
  ...positionQueries,
  ...structuresQueries,
  ...deparmentQueries,
};
