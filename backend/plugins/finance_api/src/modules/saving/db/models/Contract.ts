import { ICompanyDocument } from 'erxes-api-shared/core-types';
import { getFullDate } from 'erxes-api-shared/utils';
import { FilterQuery, Model, models } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { CONTRACT_STATUS } from '~/modules/saving/@types/constants';
import {
  IContract,
  IContractDocument,
} from '~/modules/saving/@types/contracts';
import { IConfig } from '~/modules/saving/@types/contractTypes';
import { contractSchema } from '~/modules/saving/db/definitions/contracts';
import { addMonths, getNumber } from '~/modules/saving/db/utils/utils';

export interface IContractModel extends Model<IContractDocument> {
  getContract(
    selector: FilterQuery<IContractDocument>,
  ): Promise<IContractDocument>;
  createContract(doc: IContract): Promise<IContractDocument>;
  updateContract(_id: string, doc: IContract): Promise<IContractDocument>;
  removeContract(_ids: string[]): Promise<ICompanyDocument>;
}

export const loadContract = (models: IModels) => {
  class Contract {
    /**
     *
     * Get ContractType
     */

    public static async getContract(selector: FilterQuery<IContractDocument>) {
      const contract = await models.Contracts.findOne(selector);

      if (!contract) {
        throw new Error('Contract not found');
      }

      return contract;
    }

    /**
     * Create a insuranceType
     */

    public static async createContract(doc: IContract) {
      doc.status = CONTRACT_STATUS.NORMAL;
      doc.startDate = getFullDate(doc.startDate || new Date());
      doc.endDate = addMonths(new Date(doc.startDate), doc.duration);
      doc.lastStoredDate = getFullDate(doc.startDate || new Date());
      doc.number = await getNumber(models, doc.contractTypeId);

      return await models.Contracts.create(doc);
    }

    /**
     * Update Contract
     */

    public static async updateContract(
      _id: string,
      doc: IContract,
    ): Promise<IContractDocument | null> {
      const oldContract = await models.Contracts.getContract({ _id });

      if (oldContract.contractTypeId !== doc.contractTypeId) {
        doc.number = await getNumber(models, doc.contractTypeId);
      }

      doc.startDate = getFullDate(doc.startDate || new Date());
      doc.endDate = addMonths(new Date(doc.startDate), doc.duration);
      doc.lastStoredDate = getFullDate(doc.startDate || new Date());

      await models.Contracts.updateOne({ _id }, { $set: doc });

      return await models.Contracts.findOne({ _id });
    }

    /**
     * Close Contract
     */

    // public static async closeContract(doc: ICloseVariable) {
    //   const config: IConfig = await
    // }

    /**
     * Remove Contract category
     */

    public static async removeContract(_ids: string[]) {
      //   const transactions = await models.Transactions.countDocuments({
      //     contractId: _ids,
      //   });

      //   if (transactions > 0) {
      //     throw new Error('You can not delete contract with transaction');
      //   }

      return models.Contracts.deleteMany({ _id: { $in: _ids } });
    }

    /**
     * Expand Duration
     */

    public static async expandDuration(_id: string, contractTypeId: string) {
      const contract = await models.Contracts.findOne({ _id: _id });

      if (contract) {
        const endDate = addMonths(new Date(), contract?.duration);

        await models.Contracts.updateOne(
          { _id: contract._id },

          { $set: { endDate: endDate, contractTypeId } },
        );
      }

      return contract;
    }

    /**
     * Interest Changea
     */

    public static async interestChange({
      contractId,
      interestAmount,
    }: {
      contractId: string;
      interestAmount: number;
      stoppedDAte: Date;
      isStopLoss: boolean;
      lossAmount: number;
    }) {
      const contract = await models.Contracts.findOne({ _id: contractId });

      await models.Contracts.updateOne(
        { _id: contractId },
        { $inc: { storedInterest: interestAmount } },
      ).lean();

      return contract;
    }

    /**
     * Interest Return
     */

    public static async interestReturn({
      contractId,
      interestAmount,
    }: {
      contractId: string;
      interestAmount: number;
      invDate: Date;
    }) {
      const contract = await models.Contracts.findOne({ _id: contractId });

      await models.Contracts.updateOne(
        { _id: contractId },
        { $inc: { storedInterest: interestAmount * -1 } },
      ).lean();

      return contract;
    }

    public static async getContractAlert() {}
  }

  contractSchema.loadClass(Contract);
  return contractSchema;
};
