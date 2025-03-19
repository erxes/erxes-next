import { IContext } from 'backend/core-api/src/connectionResolvers';
import { IBrand } from 'erxes-api-utils';

interface IBrandsEdit extends IBrand {
  _id: string;
}

export const brandMutations = {
  /**
   * Create new brand
   */
  async brandsAdd(_root, doc: IBrand, { user, models, subdomain }: IContext) {
    const brand = await models.Brands.createBrand({ userId: user._id, ...doc });

    return brand;
  },

  /**
   * Update brand
   */
  async brandsEdit(
    _root,
    { _id, ...fields }: IBrandsEdit,
    { user, models, subdomain }: IContext,
  ) {
    const updated = await models.Brands.updateBrand(_id, fields);

    return updated;
  },

  /**
   * Delete brand
   */
  async brandsRemove(
    _root,
    { _id }: { _id: string },
    { user, models, subdomain }: IContext,
  ) {
    const brand = await models.Brands.getBrand({ _id });
    const removed = await models.Brands.removeBrand(_id);

    return removed;
  },
};

export default brandMutations;
