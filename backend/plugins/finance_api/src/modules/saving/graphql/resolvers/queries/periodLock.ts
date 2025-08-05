import { checkPermission } from 'erxes-api-shared/core-modules';
import { cursorPaginate } from 'erxes-api-shared/utils';
import { IContext, IModels } from '~/connectionResolvers';
import {
  IPeriodLockDocument,
  IPeriodLockQueryParams,
} from '~/modules/saving/@types/periodLockTypes';

const generateFilter = async (
  params: IPeriodLockQueryParams,
  models: IModels,
) => {
  const filter: any = {};

  if (params.startDate) {
    filter.payDate = { $gte: new Date(params.startDate) };
  }

  if (params.endDate) {
    filter.payDate = {
      $lte: new Date(params.endDate),
    };
  }

  return filter;
};

export const sortBuilder = (params: IPeriodLockQueryParams) => {
  const sortField = params.sortField;
  const sortDirection = params.sortDirection || 0;

  if (sortField) {
    return { [sortField]: sortDirection };
  }

  return {};
};

const periodLockQueries = {
  /**
   * PeriodLock list
   */
  savingsPeriodLocks: async (
    _root: undefined,
    params: IPeriodLockQueryParams,
    { models }: IContext,
  ) => {
    const filter = await generateFilter(params, models);

    return await models.PeriodLocks.find(filter).lean();
  },

  /**
   * PeriodLocks for only main list
   */
  savingsPeriodLocksMain: async (
    _root: undefined,
    params: IPeriodLockQueryParams,
    { models }: IContext,
  ) => {
    const filter = await generateFilter(params, models);

    return await cursorPaginate<IPeriodLockDocument>({
      model: models.PeriodLocks,
      params,
      query: filter,
    });
  },

  /**
   * Get one periodLock
   */
  savingsPeriodLockDetail: async (
    _root,
    { _id }: IPeriodLockDocument,
    { models }: IContext,
  ) => {
    return await models.PeriodLocks.getPeriodLock({ _id });
  },
};

checkPermission(periodLockQueries, 'periodLocks', 'showPeriodLocks');
checkPermission(periodLockQueries, 'periodLocksMain', 'showPeriodLocks');
checkPermission(periodLockQueries, 'periodLockDetail', 'showPeriodLocks');

export default periodLockQueries;
