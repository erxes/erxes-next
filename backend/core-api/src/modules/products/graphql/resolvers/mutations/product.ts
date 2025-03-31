import { IProduct } from 'erxes-core-types';
import { IContext } from '../../../../../@types';

export const productMutations = {
  /**
   * Creates a new product
   * @param {Object} doc Product document
   */
  async productsAdd(_root: undefined, doc: IProduct, { models }: IContext) {
    return await models.Products.createProduct(doc);
  },

  /**
   * Edits a product
   * @param {string} _id Product id
   * @param {Object} param2.doc Product info
   */
  async productsEdit(
    _root: undefined,
    { _id, ...doc }: { _id: string } & IProduct,
    { models }: IContext,
  ) {
    return await models.Products.updateProduct(_id, {
      ...doc,
      status: 'active',
    });
  },

  /**
   * Removes a product
   * @param {string} param1._id Product id
   */
  async productsRemove(
    _root: undefined,
    { productIds }: { productIds: string[] },
    { models }: IContext,
  ) {
    return await models.Products.removeProducts(productIds);
  },

  /**
   * Merge products
   */
  async productsMerge(
    _root: undefined,
    {
      productIds,
      productFields,
    }: { productIds: string[]; productFields: IProduct },
    { models }: IContext,
  ) {
    return models.Products.mergeProducts(productIds, { ...productFields });
  },

  /**
   * Duplicate a product
   */
  async productsDuplicate(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return await models.Products.duplicateProduct(_id);
  },
};
