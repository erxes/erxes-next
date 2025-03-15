import { IContext } from 'backend/core-api/src/connectionResolvers';
import { generateFilters } from '../../../../modules/structure/utils';
import { paginate } from 'erxes-api-utils';

export default {
  async branches(_root, params: any, { models, user }: IContext) {
    const filter = await generateFilters({
      models,
      user,
      type: 'branch',
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

    return models.Branches.aggregate(pipeline);
  },

  async branchesMain(
    _root,
    params: { searchValue?: string; perPage: number; page: number },
    { models, user }: IContext,
  ) {
    const filter = await generateFilters({
      models,
      user,
      type: 'branch',
      params: {
        ...params,
        withoutUserFilter: true,
      },
    });
    const list = await paginate(
      models.Branches.find(filter).sort({
        order: 1,
      }),
      params,
    );
    const totalCount = await models.Branches.find(filter).countDocuments();

    return { list, totalCount };
  },

  async branchDetail(_root, { _id }, { models }: IContext) {
    return models.Branches.getBranch({ _id });
  },
};
