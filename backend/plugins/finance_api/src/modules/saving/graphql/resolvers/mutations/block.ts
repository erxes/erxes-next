import { IContext } from '~/connectionResolvers';
import { IBlock } from '~/modules/saving/@types/blockTypes';
import { savingsContractChanged } from '~/modules/saving/graphql/resolvers/mutations/contract';

const blockMutations = {
  savingsBlockAdd: async (
    _root: undefined,
    doc: IBlock,
    { models }: IContext,
  ) => {
    const transaction = await models.Blocks.createBlock(doc);

    if (transaction.contractId) {
      const contract = await models.Contracts.findOne({
        _id: transaction.contractId,
      });
      if (contract) {
        await savingsContractChanged(contract);
      }
    }

    return transaction;
  },

  /**
   * Removes blocks
   */
  savingsBlockRemove: async (
    _root: undefined,
    { transactionIds }: { transactionIds: string[] },
    { models }: IContext,
  ) => {
    const blocks = await models.Blocks.find({ _id: { $in: transactionIds } });

    await models.Blocks.removeBlocks(blocks.map((a) => a._id));

    return transactionIds;
  },
};

export default blockMutations;
