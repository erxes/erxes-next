import { FilterQuery } from 'mongoose';
import { IContext } from '~/connectionResolvers';
import { IConfigDocument, IConfigFilterQuery } from '~/modules/config/types';

export const configQueries = {
  getFinanceConfigs: async (
    _root: undefined,
    args: IConfigFilterQuery,
    { models }: IContext,
  ) => {
    const { name, contentId } = args;

    // By default return default configs for loan
    const query: FilterQuery<IConfigDocument> = {
      contentId: { $in: [null, ''] },
    };

    if (name) {
      query.name = name;
    }

    if (contentId) {
      query.contentId = { $in: [null, '', contentId] };
    }

    return models.Configs.find(query).sort({ contentId: 1 }).lean();
  },
};
