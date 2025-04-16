import { IContext } from '~/connectionResolvers';
import { defaultPaginate } from 'erxes-api-shared/utils';
import { generateFilters } from './utils';

export const deparmentQueries = {
  async departments(_root: undefined, params: any, { models, user }: IContext) {
    const filter = await generateFilters({
      models,
      user,
      type: 'department',
      params,
    });
    const pipeline: any[] = [{ $match: filter }, { $sort: { order: 1 } }];

    if (params?.ids?.length) {
      pipeline.push({
        $addFields: {
          __order: { $indexOfArray: [params.ids, '$_id'] },
        },
      });
      pipeline.push({ $sort: { __order: 1 } });
    }
    return models.Departments.aggregate(pipeline);
  },

  async departmentsMain(
    _root: undefined,
    params: { searchValue?: string; perPage: number; page: number },
    { models, user }: IContext,
  ) {
    const filter = await generateFilters({
      models,
      user,
      type: 'department',
      params: { ...params, withoutUserFilter: true },
    });
    const list = await defaultPaginate(
      models.Departments.find(filter).sort({ order: 1 }),
      params,
    );
    const totalCount = await models.Departments.find(filter).countDocuments();

    const totalUsersCount = await models.Users.countDocuments({
      ...filter,
      'departmentIds.0': { $exists: true },
      isActive: true,
    });

    return { list, totalCount, totalUsersCount };
  },

  async departmentDetail(_root: undefined, { _id }, { models }: IContext) {
    return models.Departments.getDepartment({ _id });
  },
};
