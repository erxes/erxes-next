import { cursorPaginate } from 'erxes-api-shared/utils';
import { FilterQuery } from 'mongoose';
import { IContext, IModels } from '~/connectionResolvers';
import {
  ITransactionDocument,
  ITransactionQueryParams,
} from '~/modules/saving/@types/transactions';

const generateFilter = async (
  params: ITransactionQueryParams,
  models: IModels,
) => {
  const { contractId } = params;

  const filter: any = {};

  if (contractId) {
    filter.contractId = params.contractId;
  }
  if (params.ids) {
    filter._id = { $in: [params.ids] };
  }

  return filter;
};

const transactionQueries = {
  /**
   * Get transaction list
   */
  savingsTransactions: async (
    _root: undefined,
    params: ITransactionQueryParams,
    { models }: IContext,
  ) => {
    const filter: FilterQuery<ITransactionDocument> = await generateFilter(
      params,
      models,
    );

    return await cursorPaginate<ITransactionDocument>({
      model: models.Transactions,
      params,
      query: filter,
    });
  },

  /**
   * Get one transaction
   */
  savingsTransactionDetail: async (
    _root: undefined,
    { _id },
    { models }: IContext,
  ) => {
    return models.Transactions.getTransaction({ _id });
  },
};
