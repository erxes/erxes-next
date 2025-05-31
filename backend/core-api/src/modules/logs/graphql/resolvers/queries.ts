import { ILogDocument } from 'erxes-api-shared/core-types';
import { cursorPaginate, paginate } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';

const generateFilters = (params) => {
  let filter = {};

  return filter;
};

export const logQueries = {
  async logsMainList(_root, args, { models }: IContext) {
    const filter = generateFilters(args);

    console.log(args);

    const { list, totalCount, pageInfo } = await cursorPaginate<ILogDocument>({
      model: models.Logs,
      params: { ...args, sortField: 'createdAt' },
      query: filter,
    });

    return {
      list: list.map((log: ILogDocument) => ({
        ...log,
        payload: JSON.stringify(log?.payload || {}),
      })),
      totalCount,
      pageInfo,
    };
  },
};
