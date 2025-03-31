import { branchsQueries } from './branchs';
import { positionQueries } from './positions';
import { structuresQueries } from './structure';
import { deparmentQueries } from './deparments';

export const contactMutations = {
  ...branchsQueries,
  ...positionQueries,
  ...structuresQueries,
  ...deparmentQueries,
};
