import { IContext, IModels } from '~/connectionResolvers';
import { cursorPaginate } from 'erxes-api-shared/utils';
import {
  IContractTypeDocument,
  IContractTypeFilterQueryParams,
} from '~/modules/saving/@types/contractTypes';
import { FilterQuery } from 'mongoose';

const generateFilter = async (
  params: IContractTypeFilterQueryParams,
  models: IModels,
) => {
  const filter: any = {};

  if (params.searchValue) {
    filter.$or = [
      { name: { $in: [new RegExp(`.*${params.searchValue}.*`, 'i')] } },
      { code: { $in: [new RegExp(`.*${params.searchValue}.*`, 'i')] } },
      { number: { $in: [new RegExp(`.*${params.searchValue}.*`, 'i')] } },
    ];
  }

  if (params.ids?.length) {
    filter._id = { [params.excludeIds ? '$nin' : '$in']: params.ids };
  }

  if (params.productType) {
    filter.productType = params.productType;
  }

  if (typeof params.isDeposit === 'boolean') {
    filter.isDeposit = params.isDeposit ? { $eq: true } : { $ne: true };
  }
  return filter;
};

export const sortBuilder = (params: IContractTypeFilterQueryParams) => {
  const sortField = params.sortField;
  const sortDirection = params.sortDirection || 0;

  if (sortField) {
    return { [sortField]: sortDirection };
  }

  return {};
};

const contractTypeQueries = {
  /**
   * ContractTypes list
   */
  savingsContractTypes: async (
    _root: undefined,
    params: IContractTypeFilterQueryParams,
    { models }: IContext,
  ) => {
    const filter: FilterQuery<IContractTypeDocument> = await generateFilter(
      params,
      models,
    );

    return await cursorPaginate<IContractTypeDocument>({
      model: models.ContractTypes,
      params,
      query: filter,
    });
  },

  /**
   * ContractTypes for only main list
   */

  savingsContractTypesMain: async (
    _root: undefined,
    params: IContractTypeFilterQueryParams,
    { models }: IContext,
  ) => {
    const filter: FilterQuery<IContractTypeDocument> = await generateFilter(
      params,
      models,
    );

    return await cursorPaginate<IContractTypeDocument>({
      model: models.ContractTypes,
      params: {
        ...params,
        orderBy: {
          createdAt: -1,
        },
      },
      query: filter,
    });
  },

  /**
   * Get one contractType
   */

  savingsContractTypeDetail: async (
    _root: undefined,
    { _id },
    { models }: IContext,
  ) => {
    return models.ContractTypes.getContractType({ _id });
  },
};

export default contractTypeQueries;
