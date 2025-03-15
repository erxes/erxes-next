import { IContext } from 'backend/core-api/src/connectionResolvers';
import { generateFilters } from '../../../../modules/structure/utils';
import { paginate } from 'erxes-api-utils';

export default {
  async departments(_root, params: any, { models, user }: IContext) {
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
    _root,
    params: { searchValue?: string; perPage: number; page: number },
    { models, user }: IContext,
  ) {
    const filter = await generateFilters({
      models,
      user,
      type: 'department',
      params: { ...params, withoutUserFilter: true },
    });
    const list = await paginate(
      models.Departments.find(filter).sort({ order: 1 }),
      params,
    );
    const totalCount = await models.Departments.find(filter).countDocuments();

    return { list, totalCount };
  },

  async departmentDetail(_root, { _id }, { models }: IContext) {
    return models.Departments.getDepartment({ _id });
  },

  async units(
    _root,
    { searchValue }: { searchValue?: string },
    { models }: IContext,
  ) {
    const filter: { $or?: any[] } = {};

    if (searchValue) {
      const regexOption = {
        $regex: `.*${searchValue.trim()}.*`,
        $options: 'i',
      };

      filter.$or = [
        {
          title: regexOption,
        },
        {
          description: regexOption,
        },
      ];
    }

    return models.Units.find(filter).sort({ title: 1 });
  },
};
