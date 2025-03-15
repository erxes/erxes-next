import { IContext } from 'backend/core-api/src/connectionResolvers';
import { generateFilters } from '../../../../modules/structure/utils';
import { paginate } from 'erxes-api-utils';

export default {
  async positions(_root, params: any, { models, user }: IContext) {
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

    return { list, totalCount };
  },

  async positionDetail(_root, { _id }, { models }: IContext) {
    return models.Positions.getPosition({ _id });
  },
};
