import { IContext } from 'backend/core-api/src/connectionResolvers';
import { paginate } from 'erxes-api-utils';

export default {
  async unitsMain(
    _root,
    params: { searchValue?: string; perPage: number; page: number },
    { models }: IContext,
  ) {
    const filter: { $or?: any[] } = {};

    if (params.searchValue) {
      const regexOption = {
        $regex: `.*${params.searchValue.trim()}.*`,
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
    const list = await paginate(
      models.Units.find(filter).sort({ createdAt: -1 }),
      params,
    );
    const totalCount = await models.Units.find(filter).countDocuments();

    const unitUserIds = (await models.Units.find(filter))
      .map((user) => user.userIds)
      .flat();

    const totalUsersCount = [...new Set(unitUserIds)].length;

    return { list, totalCount, totalUsersCount };
  },

  async unitDetail(_root, { _id }, { models }: IContext) {
    return models.Units.getUnit({ _id });
  },
};
