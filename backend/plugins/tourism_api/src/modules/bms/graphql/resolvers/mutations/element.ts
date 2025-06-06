import { IContext } from '~/connectionResolvers';

const elementMutations = {
  bmElementAdd: async (_root, doc, { user, models }: IContext) => {
    return models.Elements.createElement(doc, user);
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
    return models.ElementCategories.createElementCategory(doc);
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
