import { IContext } from '~/connectionResolvers';
import { paginate } from 'erxes-api-shared/utils';
import { generateFilters } from './utils';
export const positionQueries = {
  async positions(
    _root,
    params: any & { searchValue?: string },
    { models, user }: IContext,
  ) {
    const filter = await generateFilters({
      models,
      user,
      type: 'position',
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

    return models.Positions.aggregate(pipeline);
  },

  async positionsMain(
    _root,
    params: { searchValue?: string; perPage: number; page: number },
    { models, user }: IContext,
  ) {
    const filter = await generateFilters({
      models,
      user,
      type: 'position',
      params: { ...params, withoutUserFilter: true },
    });

    const list = await paginate(
      models.Positions.find(filter).sort({ order: 1 }),
      params,
    );

    const totalCount = await models.Positions.find(filter).countDocuments();
    const totalUsersCount = await models.Users.countDocuments({
      ...filter,
      'positionIds.0': { $exists: true },
      isActive: true,
    });

    return { list, totalCount, totalUsersCount };
  },

  async positionDetail(_root, { _id }, { models }: IContext) {
    return models.Positions.getPosition({ _id });
  },
};
