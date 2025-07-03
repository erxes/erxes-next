import { ACCOUNT_STATUSES } from '@/accounting/@types/constants';
import { IUserDocument } from 'erxes-api-shared/core-types';
import { defaultPaginate, escapeRegExp } from 'erxes-api-shared/utils';
import { IContext, IModels } from '~/connectionResolvers';

interface IQueryParams {
  startDate: Date
  endDate: Date
  description: string
  status: string
  error: string
  warning: string
  startBeginDate: Date
  endBeginDate: Date
  startSuccessDate: Date
  endSuccessDate: Date
  startCheckedDate: Date
  endCheckedDate: Date
  page?: number;
  perPage?: number;
  sortField?: string;
  sortDirection?: number;
}

export const generateFilter = async (
  models: IModels,
  params: IQueryParams,
  user: IUserDocument
) => {
  const {
    startDate,
    endDate,
    description,
    status,
    error,
    warning,
    startBeginDate,
    endBeginDate,
    startSuccessDate,
    endSuccessDate,
    startCheckedDate,
    endCheckedDate,
    page,
    perPage,
    sortField,
    sortDirection,
  } = params;
  const filter: any = {};

  filter.status = { $ne: ACCOUNT_STATUSES.DELETED };

  return filter;
};

const adjustInventoryQueries = {
  /**
   * Accounts list
   */
  async adjustInventories(
    _root,
    params: IQueryParams,
    { models, user }: IContext,
  ) {
    const filter = await generateFilter(
      models,
      params,
      user,
    );

    const { sortField, sortDirection, page, perPage } = params;

    const pagintationArgs = { page, perPage };

    let sort: any = { code: 1 };
    if (sortField) {
      sort = { [sortField]: sortDirection ?? 1 };
    }

    return await defaultPaginate(
      models.AdjustInventories.find(filter).sort(sort).lean(),
      pagintationArgs,
    )
  },

  async adjustInventoriesCount(
    _root,
    params: IQueryParams,
    { models, user }: IContext,
  ) {
    const filter = await generateFilter(
      models,
      params,
      user,
    );

    return models.AdjustInventories.find(filter).countDocuments();
  },

  async adjustInventoriesDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.Accounts.findOne({ _id }).lean();
  },
};

// requireLogin(adjustInventoryQueries, 'accountsCount');
// checkPermission(adjustInventoryQueries, 'accounts', 'showAccounts', []);

export default adjustInventoryQueries;
