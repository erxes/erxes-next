import { IContext } from '~/connectionResolvers';

const elementMutations = {
  bmElementAdd: async (_root, doc, { user, models }: IContext) => {
    const element = await models.Elements.createElement(doc, user);
    return element;
  },

  bmElementEdit: async (_root, { _id, ...doc }, { models }: IContext) => {
    const updated = await models.Elements.updateElement(_id, doc as any);
    return updated;
  },

  bmElementRemove: async (
    _root,
    { ids }: { ids: string[] },
    { models }: IContext,
  ) => {
    return await models.Elements.removeElements(ids);
  },

  bmElementCategoryAdd: async (_root, doc, { models }: IContext) => {
    const carCategory = await models.ElementCategories.createElementCategory(
      doc,
    );

    return carCategory;
  },

  bmElementCategoryEdit: async (
    _root,
    { _id, ...doc },
    { models }: IContext,
  ) => {
    const updated = await models.ElementCategories.updateElementCategory(
      _id,
      doc as any,
    );
    return updated;
  },

  bmElementCategoryRemove: async (
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    const removed = await models.ElementCategories.removeElementCategory(_id);

    return removed;
  },
};

export default elementMutations;
