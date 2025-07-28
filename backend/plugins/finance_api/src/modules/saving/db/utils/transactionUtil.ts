import { sendTRPCMessage } from 'erxes-api-shared/utils';
import { IModels } from '~/connectionResolvers';
import { getConfig } from '~/messageBroker';
import { TRANSACTION_TYPE } from '~/modules/saving/@types/constants';
import { IConfig } from '~/modules/saving/@types/contractTypes';
import { IPeriodLock } from '~/modules/saving/@types/periodLockTypes';
import {
  ITransaction,
  ITransactionDocument,
} from '~/modules/saving/@types/transactions';

export async function checkTransactionValidation(
  periodLock: IPeriodLock,
  doc: ITransaction,
) {
  if (
    periodLock &&
    doc.contractId &&
    !periodLock?.excludeContracts.includes(doc.contractId)
  ) {
    throw new Error(
      'At this moment transaction can not been created because this date closed',
    );
  }

  if (doc.transactionType === TRANSACTION_TYPE.OUTCOME) {
    const config: IConfig = await getConfig('savingConfig');
    if (!config.oneTimeTransactionLimit) {
      throw new Error('oneTimeTransactionLimit not configured');
    }
    if (config.oneTimeTransactionLimit < doc.total) {
      throw new Error('One Time Transaction Limit not configured');
    }
  }
}

export const transactionDealt = async (doc: ITransaction, models: IModels) => {
  if (doc?.dealtType === 'internal') {
    const contract = await models.Contracts.findOne({
      number: doc?.accountNumber,
    }).lean();

    if (!contract) {
      throw new Error('Dealt contract not found');
    }

    doc.contractId = contract._id;
    doc.customerId = contract.customerId;
    doc.accountHolderName = doc.accountNumber = contract.number;
    doc.transactionType = TRANSACTION_TYPE.INCOME;
    doc.balance = contract.savingAmount;

    return await models.Transactions.createTransaction(doc);
  } else if (doc?.dealtType === 'external') {
    return await externalTransaction(doc);
  }

  return null;
};

const externalTransaction = async (doc: ITransaction) => {
  const config = await getConfig('savingConfig');

  let response: any = null;

  switch (doc.externalBankName) {
    case 'loans':
      response = await loanTransaction(doc);
      break;
    case '050000':
      response = await sendTRPCMessage({
        pluginName: 'khanbank',
        method: 'query',
        module: 'khanbank',
        action: 'domesticTransfer',
        input: {
          configId: config.transactionConfigId,
          transferParams: {
            fromAccount: doc.ownBankNumber,
            toAccount: doc.accountNumber,
            amount: doc.total,
            description: doc.description,
            currency: doc.currency,
            loginName: config.transactionLoginName,
            password: config.transactionPassword,
            transfield: '',
          },
        },
        defaultValue: [],
      });

      break;
  }

  return response;
};

const loanTransaction = async (doc: ITransaction) => {
  const repayment = {
    contractId: 'FExx8N7XvdGe9BYHeJkDw',
    transactionType: 'repayment',
    payDate: doc.payDate,
    total: doc.total,
  };

  return await sendTRPCMessage({
    pluginName: 'loans',
    method: 'query',
    module: 'loans',
    action: 'transaction.add',
    input: { repayment },
    defaultValue: [],
  });
};

export const removeTransactionAfterSchedule = async (
  models: IModels,
  transaction: ITransactionDocument,
) => {
  const nextTrsCount = await models.Transactions.countDocuments({
    contractId: transaction.contractId,
    payDate: { $gt: transaction.payDate },
  }).lean();

  if (nextTrsCount > 0) {
    throw new Error(
      'this transaction is not last transaction. Please This contracts last transaction only to change or remove',
    );
  }

  if (transaction.contractReaction) {
    const { _id, ...otherData } = transaction.contractReaction;
    await models.Contracts.updateOne({ _id: _id }, { $set: otherData });
  }
};
