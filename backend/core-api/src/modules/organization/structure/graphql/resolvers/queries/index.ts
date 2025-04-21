import { branchsQueries } from './branches';
import { positionQueries } from './positions';
import { structuresQueries } from './structure';
import { deparmentQueries } from './deparments';

export const contactMutations = {
  ...branchsQueries,
  ...positionQueries,
  ...structuresQueries,
  ...deparmentQueries,
};
