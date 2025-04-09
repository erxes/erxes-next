import { paginate } from 'erxes-api-utils';
import { IContext } from '../../db/connectionResolvers';

const generateFilters = (params) => {
  let filter = {};

  return filter;
};

export const logQueries = {
  async logsMainList(_root, args, { models }: IContext) {
    const filter = generateFilters(args);
    const list = await paginate(
      models.Logs.find(filter).sort({ createdAt: -1 }),
      { ...args, perPage: 10 },
    );
    const totalCount = await models.Logs.countDocuments(filter);

    console.log({ list, totalCount });

    return { list, totalCount };
  },
};

export default { ...logQueries };
