import { Model } from 'mongoose';
import {
  IStoredInterest,
  IStoredInterestDocument,
} from '~/modules/saving/@types/storedInterest';

export interface IStoredInterestModel extends Model<IStoredInterestDocument> {
  createStoredInterest(
    payDate: Date,
    periodLockId: string,
  ): Promise<IStoredInterestDocument>;
  getStoredInterest(_id: string): Promise<IStoredInterestDocument>;
  updateStoredInterest(
    _id,
    storedInterest: IStoredInterest,
  ): Promise<IStoredInterestDocument>;
}
