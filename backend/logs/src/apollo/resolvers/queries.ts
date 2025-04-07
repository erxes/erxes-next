import { IContext } from '../../db/connectionResolvers';

const generateFilters = (params) => {
  let filter = {};

  return filter;
};

export const logQueries = {
  async logMainList(_root, args, { models }: IContext) {
    const filter = generateFilters(args);

    const list = await models.Logs.find(filter).sort({ createdAt: -1 });
    const totalCount = await models.Logs.countDocuments(filter);

    return { list, totalCount };
  },
};

export default { ...logQueries };
