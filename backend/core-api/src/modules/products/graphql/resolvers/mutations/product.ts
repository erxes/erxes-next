import { IContext } from 'backend/core-api/src/@types';
import { IProduct } from '../../../@types/product';

export const productMutations = {
  /**
   * Creates a new product
   * @param {Object} doc Product document
   */
  async productsAdd(_root, doc: IProduct, { models }: IContext) {
    return await models.Products.createProduct(doc);
  },

  /**
   * Edits a product
   * @param {string} _id Product id
   * @param {Object} param2.doc Product info
   */
  async productsEdit(
    _root,
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
    _root,
    { productIds }: { productIds: string[] },
    { models }: IContext,
  ) {
    return await models.Products.removeProducts(productIds);
  },

  /**
   * Merge products
   */
  async productsMerge(
    _root,
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
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return await models.Products.duplicateProduct(_id);
  },
};
