import { FilterQuery, Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { TRANSACTION_TYPE } from '~/modules/saving/@types/constants';
import { IContractDocument } from '~/modules/saving/@types/contracts';
import {
  ITransaction,
  ITransactionDocument,
} from '~/modules/saving/@types/transactions';
import { transactionSchema } from '~/modules/saving/db/definitions/transactions';
import { findContractOfTr } from '~/modules/saving/db/utils/findUtils';
import {
  checkTransactionValidation,
  removeTransactionAfterSchedule,
  transactionDealt,
} from '~/modules/saving/db/utils/transactionUtil';

export interface ITransactionModel extends Model<ITransactionDocument> {
  getTransaction(
    selector: FilterQuery<ITransactionDocument>,
  ): Promise<ITransactionDocument>;
  createTransaction(doc: ITransaction): Promise<ITransactionDocument>;
  updateTransaction(
    _id: string,
    doc: ITransaction,
  ): Promise<ITransactionDocument>;
  changeTransaction(
    _id: string,
    doc: ITransaction,
  ): Promise<ITransactionDocument>;
  removeTransaction(_ids: string[]): Promise<ITransaction>;
}

export const laodTransactionClass = (models: IModels) => {
  class Transaction {
    /**
     *
     * Get Transaction
     */

    public static async getTransaction(
      selector: FilterQuery<ITransactionDocument>,
    ) {
      const transaction = await models.Transactions.findOne(selector);

      if (!transaction) {
        throw new Error('Transaction not found');
      }
    }

    /**
     * Create a transaction
     */

    public static async createTransaction(doc: ITransaction) {
      doc = { ...doc, ...(await findContractOfTr(models, doc)) };

      const periodLock = await models.PeriodLocks.findOne({
        date: { $gte: doc.payDate },
      })
        .sort({ date: -1 })
        .lean();

      if (!periodLock) {
        throw new Error('No PeriodLock found for the given payDate.');
      }

      await checkTransactionValidation(periodLock, doc);

      const contract = await models.Contracts.findOne({
        _id: doc.contractId,
      }).lean<IContractDocument>();

      if (!contract) throw new Error('Contract not found');

      if (!doc.currency && contract?.currency) {
        doc.currency = contract?.currency;
      }

      if (!contract || !contract._id) {
        return models.Transactions.create({ ...doc });
      }

      doc.number = `${contract.number}${new Date().getTime().toString()}`;
      doc.payment = doc.total;
      doc.balance = contract.savingAmount;

      switch (doc.transactionType) {
        case TRANSACTION_TYPE.INCOME:
          await models.Contracts.updateOne(
            { _id: contract._id },
            { $inc: { savingAmount: doc.payment || 0 } },
          );
          break;
        case TRANSACTION_TYPE.OUTCOME:
          await models.Contracts.updateOne(
            { _id: contract._id },
            { $inc: { savingAmount: (doc.payment || 0) * -1 } },
          );

          if (doc.dealtType) {
            doc.dealtResponse = await transactionDealt({ ...doc }, models);
          }
          break;

        default:
          break;
      }

      return await models.Transactions.create({ ...doc });
    }

    /**
     * Update Transaction
     */
    public static async updateTransaction(_id: string, doc: ITransaction) {
      doc = { ...doc, ...(await findContractOfTr(models, doc)) };

      const periodLock = await models.PeriodLocks.findOne({
        date: { $gte: doc.payDate },
      })
        .sort({ date: -1 })
        .lean();

      if (
        periodLock &&
        !periodLock?.excludeContracts.includes(doc.contractId || 'undefined')
      ) {
        throw new Error(
          'At this moment transaction can not been created because this date closed',
        );
      }

      const oldTr = await models.Transactions.getTransaction({ _id });

      const contract = await models.Contracts.findOne({
        _id: doc.contractId,
      }).lean();

      if (!contract || !contract._id) {
        await models.Transactions.updateOne({ _id }, { $set: { ...doc } });
        return models.Transactions.getTransaction({ _id });
      }

      await removeTransactionAfterSchedule(models, oldTr);

      const newTransaction = await models.Transactions.getTransaction({
        _id,
      });

      return newTransaction;
    }

    /**
     * ReConfig amounts or change Transaction
     */
    public static async changeTransaction(_id: string, doc: ITransaction) {
      const oldTransaction = await models.Transactions.getTransaction({ _id });

      const periodLock = await models.PeriodLocks.findOne({
        date: { $gte: oldTransaction.payDate },
      })
        .sort({ date: -1 })
        .lean();

      if (
        periodLock &&
        oldTransaction.contractId &&
        !periodLock?.excludeContracts.includes(oldTransaction.contractId)
      )
        throw new Error(
          'At this moment transaction can not been created because this date closed',
        );

      const contract = await models.Contracts.findOne({
        _id: oldTransaction.contractId,
      }).lean();

      if (!contract || !contract._id) {
        await models.Transactions.updateOne({ _id }, { $set: { ...doc } });
        return models.Transactions.getTransaction({ _id });
      }

      const newTotal = doc.payment || 0;

      await models.Transactions.updateOne(
        { _id },
        { $set: { ...doc, total: newTotal } },
      );

      let newTransaction = await models.Transactions.getTransaction({ _id });

      return newTransaction;
    }

    /**
     * Remove Transaction
     */
    public static async removeTransaction(_ids: string[]) {
      const transactions: ITransactionDocument[] =
        await models.Transactions.find({ _id: _ids })
          .sort({ payDate: -1 })
          .lean();

      for await (const oldTr of transactions) {
        if (oldTr) {
          const periodLock = await models.PeriodLocks.findOne({
            date: { $gte: oldTr.payDate },
          })
            .sort({ date: -1 })
            .lean();

          if (
            periodLock &&
            !periodLock?.excludeContracts.includes(
              oldTr.contractId || 'undefined',
            )
          )
            throw new Error(
              'At this moment transaction can not been created because this date closed',
            );

          if (oldTr.contractId) {
            await models.Contracts.updateOne(
              { _id: oldTr.contractId },
              { $set: { savingAmount: oldTr.contractReaction?.savingAmount } },
            );
          }

          await models.Transactions.deleteOne({ _id: oldTr._id });
        }
      }
    }
  }

  return transactionSchema.loadClass(Transaction);
};
