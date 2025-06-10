import { ICarCategoryDocument } from '~/modules/module/@types/category';
import { IContext } from '~/connectionResolvers';

export default {
  __resolveReference: async (
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    return models.CarCategories.findOne({ _id });
  },
  isRoot: (category: ICarCategoryDocument) => {
    return category.parentId ? false : true;
  },
};
