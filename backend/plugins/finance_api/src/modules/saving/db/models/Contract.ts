import { ICompanyDocument } from 'erxes-api-shared/core-types';
import { getFullDate } from 'erxes-api-shared/utils';
import { FilterQuery, Model, models } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { getConfig } from '~/messageBroker';
import {
  CONTRACT_STATUS,
  TRANSACTION_TYPE,
} from '~/modules/saving/@types/constants';
import {
  ICloseVariable,
  IContract,
  IContractDocument,
} from '~/modules/saving/@types/contracts';
import { IConfig } from '~/modules/saving/@types/contractTypes';
import { ITransaction } from '~/modules/saving/@types/transactions';
import { contractSchema } from '~/modules/saving/db/definitions/contracts';
import {
  addMonths,
  calcInterest,
  getDiffDay,
  getNumber,
} from '~/modules/saving/db/utils/utils';

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

    public static async closeContract(doc: ICloseVariable) {
      const config: IConfig = await getConfig('savingConfig');

      const contract = await models.Contracts.getContract({
        _id: doc.contractId,
      });

      const depositAccount = await models.Contracts.findOne({
        _id: contract.depositAccount,
      });

      if (!depositAccount) {
        throw new Error('Deposit account not found');
      }

      if (contract.endDate < doc.closeDate) {
        const diffDay = getDiffDay(contract.startDate, doc.closeDate);

        const interest = calcInterest({
          balance: contract.savingAmount,
          interestRate: contract.closeInterestRate,
          dayOfMonth: diffDay,
          fixed: config.calculationFixed,
        });

        const returnAmount = new BigNumber(contract.storedInterest)
          .minus(interest)
          .toNumber();

        const returnTransaction: ITransaction = {
          payDate: doc.closeDate,
          total: returnAmount,
          payment: returnAmount,
          transactionType: TRANSACTION_TYPE.OUTCOME,
          description: 'interest return for close',
          contractId: contract._id,
        };

        await models.Transactions.createTransaction(returnTransaction);

        const totalGiveAmount = new BigNumber(contract.savingAmount)
          .plus(interest)
          .toNumber();

        const depositGiveTransaction: ITransaction = {
          payDate: doc.closeDate,
          total: totalGiveAmount,
          payment: totalGiveAmount,
          transactionType: TRANSACTION_TYPE.INCOME,
          description: 'interest return for close',
          contractId: depositAccount._id,
        };

        await models.Transactions.createTransaction(depositGiveTransaction);

        await models.Contracts.updateOne(
          { _id: contract._id },
          { $set: { status: CONTRACT_STATUS.CLOSED } },
        );

        return contract;
      }
    }

    /**
     * Remove Contract category
     */

    public static async removeContract(_ids: string[]) {
      const transactions = await models.Transactions.countDocuments({
        contractId: _ids,
      });

      if (transactions > 0) {
        throw new Error('You can not delete contract with transaction');
      }

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
