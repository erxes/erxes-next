import { getFullDate } from 'erxes-api-shared/utils';
import { FilterQuery, Model, models } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { CONTRACT_STATUS } from '~/modules/saving/@types/constants';
import {
  IPeriodLock,
  IPeriodLockDocument,
} from '~/modules/saving/@types/periodLockTypes';

export interface IPeriodLockModel extends Model<IPeriodLockDocument> {
  getPeriodLock(
    selector: FilterQuery<IPeriodLockDocument>,
  ): Promise<IPeriodLockDocument>;
  createPeriodLock(doc: IPeriodLock): Promise<IPeriodLockDocument>;
  updatePeriodLock(_id: string, doc: IPeriodLock): Promise<IPeriodLockDocument>;
  removePeriodLocks(_ids: string[]): Promise<IPeriodLockDocument>;
}

export const loadPeriodLock = (models: IModels) => {
  class PeriodLock {
    /**
     *
     * Get PeriodLock
     */

    public static async getPeriodLock(
      selector: FilterQuery<IPeriodLockDocument>,
    ) {
      const periodLock = await models.PeriodLocks.findOne(selector);

      if (!periodLock) {
        throw new Error('PeriodLock not found.');
      }
    }

    /**
     * Create PeriodLock
     */

    public static async createPeriodLock(doc: IPeriodLock) {
      const nextLock = await models.PeriodLocks.findOne({
        date: { $gte: doc.date },
      })
        .sort({ date: -1 })
        .lean();

      if (nextLock) {
        throw new Error(
          "Can't lock period at this time because already locked",
        );
      }

      const periodLocks = await models.PeriodLocks.create(doc);

      const nowDate = getFullDate(doc.date);

      const contracts = await models.PeriodLocks.find({
        status: CONTRACT_STATUS.NORMAL,
        interestRate: { $gte: 0 },
      }).lean();

      // for await (let contract of contracts) {
      //   const lastStoredDate = getFullDate(contract.lastStoredDate);
      //   const diffDay = getDiffDay(lastStoredDate, nowDate);
      //   if (diffDay > 0) await storeInterest(contract, models, nowDate);
      // }
      return contracts;
    }
  }
};
