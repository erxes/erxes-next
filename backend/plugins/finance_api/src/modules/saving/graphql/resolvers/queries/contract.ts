import { cursorPaginate } from 'erxes-api-shared/utils';
import { FilterQuery } from 'mongoose';
import { IContext, IModels } from '~/connectionResolvers';
import {
  IContract,
  IContractDocument,
  IContractFilterQueryParams,
} from '~/modules/saving/@types/contracts';

const generateFilter = async (
  params: IContractFilterQueryParams,
  models: IModels,
) => {
  const filter: any = {};

  if (params.ids) {
    filter._id = { $in: [params.ids] };
  }

  if (params.customerId) {
    filter.customerId = params.customerId;
  }

  return filter;
};

const contractQueries = {
  async contractType(contract: IContract, _: undefined, { models }: IContext) {
    return await models.ContractTypes.findOne({ _id: contract.contractTypeId });
  },

  /**
   * Contract list
   */

  savingContracts: async (
    _root: undefined,
    params: IContractFilterQueryParams,
    { models }: IContext,
  ) => {
    const filter: FilterQuery<IContractDocument> = await generateFilter(
      params,
      models,
    );

    console.log(111, filter);

    return await cursorPaginate<IContractDocument>({
      model: models.Contracts,
      params,
      query: filter,
    });
  },

  async hasTransation(
    contract: IContractDocument,
    _: undefined,
    { models }: IContext,
  ) {
    return (
      (await models.Transactions.countDocuments({ contractId: contract._id })) >
      0
    );
  },

  async savingTransactionHistory(
    contract: IContractDocument,
    _: undefined,
    { models }: IContext,
  ) {
    return await models.Transactions.find({
      contractId: contract._id,
    })
      .sort({ createdAt: -1 })
      .lean();
  },

  //   async storeInterest(
  //     contract: IContractDocument,
  //     _: undefined,
  //     { models }: IContext,
  //   ) {
  //     return await models.Transactions.find({
  //       contractId: contract._id,
  //     })
  //       .sort({ createdAt: -1 })
  //       .lean();
  //   },

  async remainAmount(
    contract: IContractDocument,
    _: undefined,
    { models }: IContext,
  ) {
    const contractType = await models.ContractTypes.findOne({
      _id: contract.contractTypeId,
    });

    if (contractType)
      return (
        (contract.savingAmount / 100) * contractType.limitPercentage -
        contract.blockAmount
      );
  },
};

export default contractQueries;
