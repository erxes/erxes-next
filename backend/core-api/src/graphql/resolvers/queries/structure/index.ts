import { IContext } from 'backend/core-api/src/connectionResolvers';
import branchQueries from './branch';
import departmentQueries from './department';
import unitQueries from './unit';
import positionQueries from './position';

export const structureQueries = {
  async structureDetail(_root, _args, { models }: IContext) {
    return models.Structures.findOne();
  },

  ...branchQueries,
  ...departmentQueries,
  ...unitQueries,
  ...positionQueries,
};
