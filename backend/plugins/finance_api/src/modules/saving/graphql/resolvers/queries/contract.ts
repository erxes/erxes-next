import { IContext } from '~/connectionResolvers';
import {
  IContract,
  IContractDocument,
} from '~/modules/saving/@types/contracts';

const contractQueries = {
  async contractType(contract: IContract, _: undefined, { models }: IContext) {
    return await models.ContractTypes.findOne({ _id: contract.contractTypeId });
  },

  async hasTransation(
    contract: IContractDocument,
    _: undefined,
    { models }: IContext,
  ) {
    return (
      (await models.Transactions.countDocuments({ contractId: contract._id })) >
      0
    );
  },

  async savingTransactionHistory(
    contract: IContractDocument,
    _: undefined,
    { models }: IContext,
  ) {
    return await models.Transactions.find({
      contractId: contract._id,
    })
      .sort({ createdAt: -1 })
      .lean();
  },

  //   async storeInterest(
  //     contract: IContractDocument,
  //     _: undefined,
  //     { models }: IContext,
  //   ) {
  //     return await models.Transactions.find({
  //       contractId: contract._id,
  //     })
  //       .sort({ createdAt: -1 })
  //       .lean();
  //   },

  async remainAmount(
    contract: IContractDocument,
    _: undefined,
    { models }: IContext,
  ) {
    const contractType = await models.ContractTypes.findOne({
      _id: contract.contractTypeId,
    });

    if (contractType)
      return (
        (contract.savingAmount / 100) * contractType.limitPercentage -
        contract.blockAmount
      );
  },
};

export default contractQueries;
