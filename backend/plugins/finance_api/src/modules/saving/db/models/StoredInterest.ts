import { getFullDate } from 'erxes-api-shared/utils';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { CONTRACT_STATUS } from '~/modules/saving/@types/constants';
import { IContractDocument } from '~/modules/saving/@types/contracts';
import {
  IStoredInterest,
  IStoredInterestDocument,
} from '~/modules/saving/@types/storedInterest';
import { getDiffDay } from '~/modules/saving/db/utils/utils';

export interface IStoredInterestModel extends Model<IStoredInterestDocument> {
  createStoredInterest(
    payDate: Date,
    periodLockId: string,
  ): Promise<IStoredInterestDocument>;
  getStoredInterest(_id: string): Promise<IStoredInterestDocument>;
  updateStoredInterest(
    _id: string,
    storedInterest: IStoredInterest,
  ): Promise<IStoredInterestDocument>;
}

export const loadSavingStoredInterestClass = (models: IModels) => {
  class storedInterest {
    public static async createStoredInterest(
      payDate: Date,
      periodLock: string,
    ) {
      const storeInterestDate = getFullDate(payDate);

      const contracts: IContractDocument[] = await models.Contracts.find({
        lastStoredDate: { $lt: storeInterestDate },
        status: CONTRACT_STATUS.NORMAL,
      }).lean();

      if (contracts.length > 0) {
        for (const contract of contracts) {
          const prevSchedule: any = {};

          let balanceAmount = 1;

          if (prevSchedule) {
            balanceAmount = prevSchedule.balance;
          } else {
            balanceAmount = contract.savingAmount;
          }

          let storedInterest = Number(
            (
              ((balanceAmount * contract.interestRate) / 100 / 365) *
              getDiffDay(contract.lastStoredDate, storeInterestDate)
            ).toFixed(0),
          );

          await models.StoredInterest.create({
            amount: storedInterest,
            contractId: contract._id,
            invDate: storeInterestDate,
            prevStoredDate: contract.lastStoredDate,
            periodLockId: periodLock,
            number: contract.number,
          });

          await models.Contracts.updateOne(
            { _id: contract._id },
            {
              $inc: { storedInterest: storedInterest },
              $set: { lastStoredDate: storeInterestDate },
            },
          );
        }
      }

      return {};
    }

    public static async getStoredInterest(
      _id: string,
      storedInterest: IStoredInterest,
    ) {
      return await models.StoredInterest.findOne({ _id }).lean();
    }

    public static async updateStoredInterest(
      _id: string,
      storedInterest: IStoredInterest,
    ) {
      return await models.StoredInterest.updateOne(
        { _id },
        { $set: storedInterest },
      );
    }
  }
};
