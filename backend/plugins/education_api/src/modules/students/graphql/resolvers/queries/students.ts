import { cursorPaginate } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';

type IListArgs = {
  sortDirection?: number;
  sortField?: string;
  searchValue?: string;
  isActive?: boolean;
};

export const studentQueries = {
  students: async (
    _root: undefined,
    params: IListArgs,
    { models }: IContext,
  ) => {
    const { list, totalCount, pageInfo } = await cursorPaginate({
      model: models.Students,
      params,
      query: {},
    });

    return { list, totalCount, pageInfo };
  },
};
