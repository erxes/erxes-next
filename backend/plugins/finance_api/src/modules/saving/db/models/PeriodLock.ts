import { getFullDate } from 'erxes-api-shared/utils';
import { FilterQuery, Model, models } from 'mongoose';
import { IModels, loadClasses } from '~/connectionResolvers';
import { CONTRACT_STATUS } from '~/modules/saving/@types/constants';
import {
  IPeriodLock,
  IPeriodLockDocument,
} from '~/modules/saving/@types/periodLockTypes';
import {
  IStoredInterest,
  IStoredInterestDocument,
} from '~/modules/saving/@types/storedInterest';
import { periodLockSchema } from '~/modules/saving/db/definitions/periodLocks';
import storedInterest from '~/modules/saving/db/utils/storedInterest';
import { getDiffDay } from '~/modules/saving/db/utils/utils';

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

    public static async getPeriodLock(selector: FilterQuery<IPeriodLock>) {
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

      const contracts = await models.Contracts.find({
        status: CONTRACT_STATUS.NORMAL,
        interestRate: { $gte: 0 },
      }).lean();

      for await (let contract of contracts) {
        const lastStoredDate = getFullDate(contract.lastStoredDate);
        const diffDay = getDiffDay(lastStoredDate, nowDate);
        if (diffDay > 0) await storedInterest(contract, models, nowDate);
      }

      return periodLocks;
    }

    /**
     * Update PeriodLock
     */
    public static async updatePeriodLock(_id: string, doc: IPeriodLock) {
      await models.PeriodLocks.updateOne({ _id }, { $set: doc });

      return models.PeriodLocks.findOne({ _id });
    }

    /**
     * Remove PeriodLock
     */
    public static async removePeriodLock(_ids: string[]) {
      const storedInterestList: IStoredInterestDocument[] =
        await models.StoredInterest.find({ periodLock: { $in: _ids } }).lean();

      for (const storedInterest of storedInterestList) {
        await models.Contracts.updateOne(
          { _id: storedInterest.contractId },
          {
            $set: {
              storedInterest: { $inc: storedInterest.amount * -1 },
              lastStoredDate: storedInterest.prevStoredDate,
            },
          },
        );
      }

      await models.StoredInterest.deleteMany({
        _id: storedInterestList.map((a) => a._id),
      });

      return models.PeriodLocks.deleteMany({ _id: { $in: _ids } });
    }
  }
  periodLockSchema.loadClass(PeriodLock);
  return periodLockSchema;
};
