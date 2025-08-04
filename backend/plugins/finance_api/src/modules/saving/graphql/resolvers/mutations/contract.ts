import { checkPermission } from 'erxes-api-shared/core-modules';
import { graphqlPubsub, sendTRPCMessage } from 'erxes-api-shared/utils';
import { __DirectiveLocation } from 'graphql';
import { models } from 'mongoose';
import { IContext } from '~/connectionResolvers';
import { TRANSACTION_TYPE } from '~/modules/saving/@types/constants';
import {
  ICloseVariable,
  IContract,
  IContractDocument,
} from '~/modules/saving/@types/contracts';

export const savingsContractChanged = async (contract: IContractDocument) => {
  graphqlPubsub.publish('savingsContractChanged', {
    savingsContractChanged: contract,
  });
};

export const contractMutations = {
  savingsContractsAdd: async (
    _root: undefined,
    doc: IContract,
    { models }: IContext,
  ) => {
    console.log(doc);

    return await models.Contracts.createContract(doc);
  },

  clientSavingsContractsAdd: async (
    _root: undefined,
    doc: IContract & { secondaryPassword: string },
    { models }: IContext,
  ) => {
    let savingAmount = doc.savingAmount;
    if (!doc.depositAccount) {
      throw new Error(
        'No deposit account linked. Please select a deposit account to proceed with your savings.',
      );
    }

    doc.savingAmount = 0;

    const contract = await models.Contracts.createContract(doc);

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
    });

    if (validate?.status === 'error') {
      throw new Error(validate.errorMessage);
    }

    const customer = await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'customer',
      action: 'customers.findOne',
      input: { _id: doc.customerId },
    });
    if (savingAmount > 0 && contract) {
      const deposit = await models.Contracts.findOne({
        _id: doc.depositAccount,
      }).lean();

      if (!deposit) {
        throw new Error(`Contract ${doc.depositAccount} not found`);
      }

      await models.Transactions.createTransaction({
        payDate: doc.startDate,
        total: savingAmount,
        transactionType: TRANSACTION_TYPE.OUTCOME,
        contractId: deposit._id,
        customerId: doc.customerId,
        description: 'saving',
        payment: savingAmount,
        accountNumber: contract.number,
        accountHolderName: customer.firstName,
      });

      await models.Transactions.createTransaction({
        payDate: doc.startDate,
        total: savingAmount,
        transactionType: TRANSACTION_TYPE.INCOME,
        contractId: contract._id,
        customerId: doc.customerId,
        description: 'saving',
        payment: savingAmount,
        accountNumber: deposit.number,
        accountHolderName: customer.firstName,
      });
    }
    return contract;
  },

  clientSavingSubmit: async (
    _root: undefined,
    { customerId }: { customerId: string },
    { models }: IContext,
  ) => {
    const customer = await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'customer',
      action: 'ustomers.findOne',
      input: { _id: customerId },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    const existingContract = await models.Contracts.findOne({
      isDeposit: true,
      customerId: customer._id,
    });

    if (existingContract) {
      throw new Error('Contract exist!');
    }

    const contractType = await models.ContractTypes.findOne({
      isDeposit: true,
    });

    if (!contractType) {
      throw new Error('Deposit account type not found');
    }

    const depositAccount: any = {
      customerId: customerId,
      contractTypeId: contractType._id,
      startDate: new Date(),
      isDeposit: true,
      duration: 36,
      savingAmount: 0,
      blockAmount: 0,
      closeInterestRate: 0,
      description: 'client submit',
      interestRate: 0,
      isAllowIncome: true,
      isAllowOutcome: true,
    };

    return await models.Contracts.createContract(depositAccount);
  },

  /**
   * Updates a contract
   */
  savingsContractEdit: async (
    _root: undefined,
    { _id, ...doc }: IContractDocument,
    { models }: IContext,
  ) => {
    const updated = await models.Contracts.updateContract(_id, doc);

    await savingsContractChanged(updated);
    return updated;
  },

  savingsContractDealEdit: async (
    _root: undefined,
    { _id, ...doc }: IContractDocument,
    { models }: IContext,
  ) => {
    const checkOtherDeals = await models.Contracts.countDocuments({
      dealId: doc.dealId,
      _id: { $ne: _id },
    });

    if (checkOtherDeals) {
      await models.Contracts.updateMany(
        {
          dealId: doc.dealId,
          _id: { $ne: _id },
        },
        { $set: { dealId: undefined } },
      );
    }

    const updated = await models.Contracts.updateContract(_id, doc);

    await savingsContractChanged(updated);
    return updated;
  },

  /**
   * to close contract
   */
  savingsContractsClose: async (
    _root: undefined,
    doc: ICloseVariable,
    { models }: IContext,
  ) => {
    const updated = await models.Contracts.closeContract(doc);

    await savingsContractChanged(updated);
    return updated;
  },

  /**
   * Removes contracts
   */
  savingsContractsRemove: async (
    _root: undefined,
    { contractIds }: { contractIds: string[] },
    { models }: IContext,
  ) => {
    await models.Contracts.removeContract(contractIds);

    return contractIds;
  },

  savingsExpandDuration: async (
    _root: undefined,
    { _id, contractTypeId }: { _id: string; contractTypeId: string },
    { models }: IContext,
  ) => {
    const contract = await models.Contracts.expandDuration(_id, contractTypeId);

    await savingsContractChanged(contract);

    return contract;
  },

  savingsInterestChange: async (
    _root: undefined,
    {
      contractId,
      stoppedDate,
      interestAmount,
      lossAmount,
    }: {
      contractId: string;
      stoppedDate: Date;
      isStopLoss: boolean;
      interestAmount: number;
      lossAmount: number;
    },
    { models }: IContext,
  ) => {
    return await models.Contracts.interestChange({
      contractId,
      stoppedDate,
      interestAmount,
      lossAmount,
    });
  },

  savingsInterestReturn: async (
    _root: undefined,
    {
      contractId,
      invDate,
      interestAmount,
    }: { contractId: string; invDate: Date; interestAmount: number },
    { models }: IContext,
  ) => {
    return await models.Contracts.interestReturn({
      contractId,
      invDate,
      interestAmount,
    });
  },

  sendSaving: async (_root: undefined, { data }, { models }: IContext) => {
    await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'synchpolaris',
      action: 'sendSavingContract',
      input: { data },
    });

    return 'success';
  },

  savingContractActive: async (_root: undefined, { contractNumber }) => {
    await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'synchpolaris',
      action: 'savingContractActive',
      input: { contractNumber },
    });
    return 'success';
  },

  sendDepositToPolaris: async (__DirectiveLocation, { data }) => {
    await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'synchpolaris',
      action: 'sendDeposit',
      input: { data },
    });
    return 'success';
  },

  depositContractActive: async (_root: undefined, { contractNumber }) => {
    await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'synchpolaris',
      action: 'depositContractActive',
      input: { contractNumber },
    });
    return 'success';
  },
};

// checkPermission(
//   contractMutations,
//   'savingsContractsAdd',
//   'savingsContractsAdd',
// );
// checkPermission(
//   contractMutations,
//   'savingsContractsEdit',
//   'savingsContractsEdit',
// );
// checkPermission(
//   contractMutations,
//   'savingsContractsDealEdit',
//   'savingsContractsDealEdit',
// );
// checkPermission(
//   contractMutations,
//   'savingsContractsClose',
//   'savingsContractsClose',
// );
// checkPermission(
//   contractMutations,
//   'savingsContractsRemove',
//   'savingsContractsRemove',
// );

export default contractMutations;
