import { sendTRPCMessage } from 'erxes-api-shared/utils';
import { IContractDocument } from '~/modules/saving/@types/contracts';

export default {
  customer: async (contract: IContractDocument, _args: undefined) => {
    if (contract.customerType !== 'customer') return null;

    return await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'customer',
      action: 'customer.finOne',
      input: { _id: contract.customerId },
    });
  },

  copmanies: async (contract: IContractDocument, _args: undefined) => {
    if (contract.customerType !== 'company') return null;

    return await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'company',
      action: 'company.finOne',
      input: { _id: contract.customerId },
    });
  },

  loansOfForeclosed: async (contract: IContractDocument, _args: undefined) => {
    return await sendTRPCMessage({
      pluginName: 'core',
      method: 'query',
      module: 'contract',
      action: 'contracts.find',
      input: { savingContractId: contract._id, status: { $ne: 'closed' } },
    });
  },
};
