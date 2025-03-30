import { IContext } from 'core-api/@types';
import { IUom } from 'core-api/modules/products/@types/uom';

export const uomMutations = {
  /**
   * Creates a new uom
   * @param {Object} doc uom document
   */
  async uomsAdd(_root, doc: IUom, { models }: IContext) {
    return await models.Uoms.createUom(doc);
  },

  /**
   * Edits a uom
   * @param {string} param2._id uom id
   * @param {Object} param2.doc uom info
   */
  async uomsEdit(
    _root,
    { _id, ...doc }: { _id: string } & IUom,
    { models }: IContext,
  ) {
    return await models.Uoms.updateUom(_id, doc);
  },

  /**
   * Removes a uom
   * @param {string} param1._id Uom id
   */
  async uomsRemove(
    _root,
    { uomIds }: { uomIds: string[] },
    { models }: IContext,
  ) {
    return await models.Uoms.removeUoms(uomIds);
  },
};
