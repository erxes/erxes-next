import { cursorPaginate } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import { ITeacherParams } from '~/modules/teachers/@types/teachers';

export const teacherQueries = {
  teachers: async (
    _root: undefined,
    params: ITeacherParams,
    { models }: IContext,
  ) => {
    const { list, totalCount, pageInfo } = await cursorPaginate({
      model: models.Teachers,
      params,
      query: {},
    });

    return { list, totalCount, pageInfo };
  },
};
