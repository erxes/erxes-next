import { paginate } from 'erxes-api-shared/utils';
import { IContext } from '../../db/connectionResolvers';
import { ILogDocument } from '../../db/definitions/logs';

const generateFilters = (params) => {
  let filter = {};

  return filter;
};

export const logQueries = {
  async logsMainList(_root, args, { models }: IContext) {
    const filter = generateFilters(args);
    const list = await paginate(
      models.Logs.find(filter).sort({ createdAt: -1 }),
      { ...args },
    );
    const totalCount = await models.Logs.countDocuments(filter);

    return {
      list: list.map((log: ILogDocument) => ({
        ...log.toObject(),
        payload: JSON.stringify(log?.payload || {}),
      })),
      totalCount,
    };
  },
};

export default { ...logQueries };
