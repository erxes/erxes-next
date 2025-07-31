import { sendTRPCMessage } from 'erxes-api-shared/utils';
import { ITransactionDocument } from '~/modules/saving/@types/transactions';

export default {
  company: async (transaction: ITransactionDocument, _args: undefined) => {
    return await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'company',
      action: 'companies.findOne',
      input: { _id: transaction.companyId },
    });
  },

  customer: async (transaction: ITransactionDocument, _args: undefined) => {
    return await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'companies.findOne',
      action: 'find',
      input: { _id: transaction.companyId },
    });
  },

  contract: async (transaction: ITransactionDocument, _args: undefined) => {
    return await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'contract.findOne',
      action: 'find',
      input: { _id: transaction.contractId },
    });
  },
};
