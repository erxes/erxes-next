import { checkPermission } from 'erxes-api-shared/core-modules';
import {
  cursorPaginate,
  getFullDate,
  sendTRPCMessage,
} from 'erxes-api-shared/utils';
import { FilterQuery } from 'mongoose';
import { IContext, IModels } from '~/connectionResolvers';
import {
  IContract,
  IContractDocument,
  IContractFilterQueryParams,
} from '~/modules/saving/@types/contracts';

const generateFilter = async (
  models: IModels,
  params: IContractFilterQueryParams,
) => {
  const filter: any = {};

  filter.status = { $ne: 'Deleted' };

  if (params.searchValue) {
    filter.number = { $in: [new RegExp(`.*${params.searchValue}.*`, 'i')] };
  }

  if (params.status) {
    filter.status = params.status;
  }

  if (params.ids) {
    filter._id = { $in: params.ids };
  }

  if (params.closeDate) {
    const date = getFullDate(params.closeDate);
    filter.closeDate = {
      $gte: date,
      $lte: new Date(date.getTime() + 1000 * 3600 * 24),
    };
  }

  // conformity

  if (params.contractTypeId) {
    filter.contractTypeId = params.contractTypeId;
  }

  if (params.isExpired === 'true') {
    filter.isExpired = !!params.isExpired;
  }

  if (params.repaymentDate === 'today') {
    const date = getFullDate(new Date());
    filter.repaymentDate = {
      $gte: date,
      $lte: new Date(date.getTime() + 1000 * 3600 * 24),
    };
  }

  if (params.closeDateType) {
    let currentDate = new Date();
    switch (params.closeDateType) {
      case 'today':
        const date = getFullDate(currentDate);
        filter.closeDate = {
          $gte: date,
          $lte: new Date(date.getTime() + 1000 * 3600 * 24),
        };
        break;
      case 'thisWeek':
        let firstDayOfWeek = new Date(
          currentDate.setDate(currentDate.getDate() - currentDate.getDay()),
        );
        let lastDayOfWeek = new Date(
          currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6),
        );
        filter.closeDate = {
          $gte: firstDayOfWeek,
          $lte: lastDayOfWeek,
        };
        break;
      case 'thisMonth':
        let firstDayOfMonth = new Date(
          currentDate.setDate(currentDate.getDate() - currentDate.getDay()),
        );
        let lastDayOfMonth = new Date(
          currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6),
        );
        filter.closeDate = {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth,
        };
        break;

      default:
        break;
    }
  }

  if (params.startStartDate || params.endStartDate) {
    switch (`${!!params.startStartDate}-${!!params.endStartDate}`) {
      case 'true-true':
        if (params.startStartDate && params.endStartDate) {
          filter.closeDate = {
            $gte: getFullDate(params.startStartDate),
            $lte: getFullDate(params.endStartDate),
          };
        }
        break;
      case 'false-true':
        if (params.endStartDate) {
          filter.closeDate = {
            $lte: getFullDate(params.endStartDate),
          };
        }
        break;
      case 'true-false':
        if (params.startStartDate) {
          filter.closeDate = {
            $gte: getFullDate(params.startStartDate),
          };
        }
        break;
      default:
        break;
    }
  }

  if (params.startCloseDate || params.endCloseDate) {
    switch (`${!!params.startCloseDate}-${!!params.endCloseDate}`) {
      case 'true-true':
        if (params.startCloseDate && params.endCloseDate) {
          filter.closeDate = {
            $gte: getFullDate(params.startCloseDate),
            $lte: getFullDate(params.endCloseDate),
          };
        }
        break;
      case 'false-true':
        if (params.endCloseDate) {
          filter.closeDate = {
            $lte: getFullDate(params.endCloseDate),
          };
        }
        break;
      case 'true-false':
        if (params.startCloseDate) {
          filter.closeDate = {
            $gte: getFullDate(params.startCloseDate),
          };
        }
        break;
      default:
        break;
    }
  }

  if (params.customerId) {
    filter.customerId = params.customerId;
  }
  if (params.branchId) {
    filter.branchId = params.branchId;
  }

  if (params.savingAmount) {
    filter.savingAmount = params.savingAmount;
  }

  if (params.interestRate) {
    filter.interestRate = params.interestRate;
  }

  if (params.isDeposit !== undefined) {
    filter.isDeposit = params.isDeposit || { $ne: true };
  }

  if (params.dealId) {
    filter.dealId = params.dealId;
  }

  return filter;
};

export const sortBuilder = (params: IContractFilterQueryParams) => {
  const sortField = params.sortField;
  const sortDirection = params.sortDirection || 0;

  if (sortField) {
    return { [sortField]: sortDirection };
  }

  return {};
};

const contractQueries = {
  async contractType(contract: IContract, _: undefined, { models }: IContext) {
    return await models.ContractTypes.findOne({ _id: contract.contractTypeId });
  },

  /**
   * Contract list
   */

  savingsContracts: async (
    _root: undefined,
    params: IContractFilterQueryParams,
    { models }: IContext,
  ) => {
    const filter: FilterQuery<IContractDocument> = await generateFilter(
      models,
      params,
    );

    const { list, totalCount, pageInfo } =
      await cursorPaginate<IContractDocument>({
        model: models.Contracts,
        params,
        query: filter,
      });

    return { list, totalCount, pageInfo };
  },

  clientSavingsContracts: async (
    _root: undefined,
    params: IContractFilterQueryParams,
    { models }: IContext,
  ) => {
    if (!params.customerId) throw new Error('Customer not found');

    const loanContractsQuery = await generateFilter(models, params);

    const { list, totalCount, pageInfo } =
      await cursorPaginate<IContractDocument>({
        model: models.Contracts,
        params,
        query: loanContractsQuery,
      });

    return { list, totalCount, pageInfo };
  },

  /**
   * Contracts for only main list
   */
  savingsContractsMain: async (
    _root: undefined,
    params: IContractFilterQueryParams,
    { models }: IContext,
  ) => {
    const filter = await generateFilter(models, params);

    const list = await cursorPaginate<IContractDocument>({
      model: models.Contracts,
      params,
      query: filter,
      // sort: sortBuilder(params),
    });

    const totalCount = await models.Contracts.find(filter).countDocuments();

    return {
      list,
      totalCount,
    };
  },

  /**
   * Get one contract
   */
  savingsContractDetail: async (
    _root: undefined,
    { _id },
    { models }: IContext,
  ) => {
    return await models.Contracts.getContract({ _id });
  },

  savingsCloseInfo: async (
    _root: undefined,
    { contractId, date },
    { models }: IContext,
  ) => {
    const contract = await models.Contracts.getContract({ _id: contractId });

    // return getCloseInfo(models, contract, date)
  },

  savingsContractsAlert: async (
    _root: undefined,
    { date },
    { models }: IContext,
  ) => {
    const alerts: { name: string; count: number; filter: any }[] = [];

    const filterDate = getFullDate(new Date(date));

    // expired contracts
    const expiredContracts = await models.Contracts.find({
      endDate: { $lt: filterDate },
    })
      .select({ _id: 1 })
      .lean();

    if (expiredContracts.length > 0) {
      alerts.push({
        name: 'End contracts',
        count: expiredContracts.length,
        filter: expiredContracts.map((a) => a._id),
      });
    }

    return alerts;
  },

  checkAccountBalance: async (
    _root: undefined,
    {
      contractId,
      requiredAmount,
    }: { contractId: string; requiredAmount: number },
    { models }: IContext,
  ) => {
    const account = await models.Contracts.findById({ _id: contractId });

    if (!account) {
      throw new Error('Acount not found');
    }

    if (account.savingAmount < requiredAmount) {
      throw new Error('Account balance not reached');
    }

    return 'Ok';
  },

  getAccountOwner: async (
    _root: undefined,
    { accountNumber },
    { models }: IContext,
  ) => {
    const account = await models.Contracts.findOne({ number: accountNumber });

    if (!account) {
      throw new Error('Account not found.');
    }

    if (!account.customerId) {
      throw new Error('This account has not customer.');
    }

    const customer = await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'customer',
      action: 'customer.findOne',
      input: { _id: account?.customerId },
    });

    return `${customer?.firstName} ${customer?.lastName}`;
  },
};

// checkPermission(
//   contractQueries,
//   'savingsContractsMain',
//   'savingsShowContracts',
// );
// checkPermission(
//   contractQueries,
//   'savingsContractDetail',
//   'savingsShowContracts',
// );
// checkPermission(contractQueries, 'savingsContracts', 'savingsShowContracts');

export default contractQueries;
