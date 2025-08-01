import { IContext } from "~/connectionResolvers";
import { ITransaction } from "@/accounting/@types/transaction";

const transactionsMutations = {
  async accTransactionsLink(_root, doc: { ids: string[], ptrId: string }, { user, models }) {
    const { ids, ptrId } = doc;
    return await models.Transactions.linkTransaction(ids, ptrId)
  },
  /**
   * Creates a new account category
   * @param {Object} doc Account category document
   */
  async accTransactionsCreate(
    _root,
    { trDocs }: { trDocs: ITransaction[] },
    { user, models }: IContext,
  ) {

    const transactions = await models.Transactions.createPTransaction(trDocs, user);

    return transactions;
  },

  /**
   * Edits a account category
   * @param {string} param2._id VatRow id
   * @param {Object} param2.doc VatRow info
   */
  async accTransactionsUpdate(
    _root,
    { parentId, trDocs }: { parentId: string, trDocs: (ITransaction & { _id?: string })[] },
    { user, models }: IContext,
  ) {
    const transactions = await models.Transactions.updatePTransaction(parentId, trDocs, user);

    return transactions;
  },

  /**
   * Removes a account category
   * @param {string} param1._id VatRow id
   */
  async accTransactionsRemove(
    _root,
    { parentId, ptrId }: { parentId: string, ptrId: string },
    { models }: IContext,
  ) {
    const removed = await models.Transactions.removePTransaction(parentId, ptrId);

    return removed;
  },
};

export default transactionsMutations;
