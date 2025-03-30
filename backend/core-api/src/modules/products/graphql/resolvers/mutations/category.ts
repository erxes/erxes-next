import { IContext } from 'core-api/@types';
import { IProductCategory } from 'core-api/modules/products/@types/category';

export const categoryMutations = {
  /**
   * Creates a new product category
   * @param {Object} doc Product category document
   */
  async productCategoriesAdd(
    _root,
    doc: IProductCategory,
    { models }: IContext,
  ) {
    return await models.ProductCategories.createProductCategory(doc);
  },

  /**
   * Edits a product category
   * @param {string} param2._id ProductCategory id
   * @param {Object} param2.doc ProductCategory info
   */
  async productCategoriesEdit(
    _root,
    { _id, ...doc }: { _id: string } & IProductCategory,
    { models }: IContext,
  ) {
    return await models.ProductCategories.updateProductCategory(_id, doc);
  },

  /**
   * Removes a product category
   * @param {string} param1._id ProductCategory id
   */
  async productCategoriesRemove(
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return await models.ProductCategories.removeProductCategory(_id);
  },
};
