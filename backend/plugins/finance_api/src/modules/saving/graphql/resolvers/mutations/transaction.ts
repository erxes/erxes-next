import { checkPermission } from 'erxes-api-shared/core-modules';
import { sendTRPCMessage } from 'erxes-api-shared/utils';
import { IContext } from '~/connectionResolvers';
import {
  ITransaction,
  ITransactionDocument,
} from '~/modules/saving/@types/transactions';
import { savingsContractChanged } from '~/modules/saving/graphql/resolvers/mutations/contract';

const transactionMutations = {
  /**
   * Creates a transaction
   */
  savingsTransactionsAdd: async (
    _root: undefined,
    doc: ITransaction,
    { models }: IContext,
  ) => {
    const transaction = await models.Transactions.createTransaction(doc);

    if (transaction.contractId) {
      const contract = await models.Contracts.findOne({
        _id: transaction.contractId,
      });

      if (contract) {
        //  await savingsContractChanged(contract)
      }
    }

    return transaction;
  },

  clientSavingsTransactionsAdd: async (
    _root: undefined,
    doc: ITransaction & { secondaryPassword: String },
    { models }: IContext,
  ) => {
    const validate = await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'client',
      action: 'clientPortalUsers.validatePassword',
      input: {
        userId: doc.customerId,
        password: doc.secondaryPassword,
        secondary: true,
      },
      defaultValue: [],
    });

    if (validate?.status === 'error') {
      throw new Error(validate.errorMessage);
    }

    const transaction = await models.Transactions.createTransaction(doc);

    if (transaction.contractId) {
      const contract = await models.Contracts.findOne({
        _id: transaction.contractId,
      });

      if (contract) {
        // await savingsContractChanged(conrtact);
      }
    }

    return transaction;
  },

  /**
   * Updates a transaction
   */
  savingsTransactionsEdit: async (
    _root: undefined,
    { _id, ...doc }: ITransactionDocument,
    { models }: IContext,
  ) => {
    const updated = await models.Transactions.updateTransaction(_id, doc);

    if (updated.contractId) {
      const contract = await models.Contracts.findOne({
        _id: updated.contractId,
      });
      if (contract) {
        await savingsContractChanged(contract);
      }
    }

    return updated;
  },

  /**
   * Change a transaction
   */
  savingsTransactionsChange: async (
    _root: undefined,
    { _id, ...doc }: ITransactionDocument,
    { models }: IContext,
  ) => {
    const updated = await models.Transactions.changeTransaction(_id, doc);

    if (updated.contractId) {
      const contract = await models.Contracts.findOne({
        _id: updated.contractId,
      });
      if (contract) {
        await savingsContractChanged(contract);
      }
    }

    return updated;
  },

  /**
   * Removes transactions
   */
  savingsTransactionsRemove: async (
    _root: undefined,
    { transactionIds }: { transactionIds: string[] },
    { models }: IContext,
  ) => {
    // TODO: contracts check

    const transactions = await models.Transactions.find({
      _id: transactionIds,
    }).lean();
    await models.Transactions.removeTransactions(
      transactions.map((a) => a._id),
    );

    return transactionIds;
  },
};

// checkPermission(transactionMutations, 'transactionAdd', 'manageTransaction');
// checkPermission(transactionMutations, 'transactionEdit', 'manageTransaction');
// checkPermission(transactionMutations, 'transactionChange', 'manageTransaction');
// checkPermission(transactionMutations, 'transactionRemove', 'transactionRemove');

export default transactionMutations;
