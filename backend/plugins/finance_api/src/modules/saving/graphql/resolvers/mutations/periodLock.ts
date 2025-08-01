import { checkPermission } from 'erxes-api-shared/core-modules';
import { __DirectiveLocation } from 'graphql';
import { IContext } from '~/connectionResolvers';
import {
  IPeriodLock,
  IPeriodLockDocument,
} from '~/modules/saving/@types/periodLockTypes';

const periodLockMutations = {
  savingsPeriodLock: async (
    _root: undefined,
    doc: IPeriodLock,
    { models }: IContext,
  ) => {
    return await models.PeriodLocks.createPeriodLock(doc);
  },

  /**
   * Updates a periodLock
   */
  savingsPeriodLocksEdit: async (
    _root: undefined,
    { _id, ...doc }: IPeriodLockDocument,
    { models }: IContext,
  ) => {
    return await models.PeriodLocks.updatePeriodLock(_id, doc);
  },

  /**
   * Removes periodLocks
   */
  savingsPeriodLocksRemove: async (
    _root: undefined,
    { periodLockIds }: { periodLockIds: string[] },
    { models }: IContext,
  ) => {
    return await models.PeriodLocks.removePeriodLocks(periodLockIds);
  },
};

export default periodLockMutations;

checkPermission(periodLockMutations, 'periodLocksAdd', 'managePeriodLocks');
checkPermission(periodLockMutations, 'periodLocksEdit', 'managePeriodLocks');
checkPermission(periodLockMutations, 'periodLocksRemove', 'managePeriodLocks');
