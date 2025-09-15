import { IContext } from '~/connectionResolvers';
import { ITemplate } from '~/modules/template/@types/template';

export const templateMutations = {
  createTemplate: async (
    _parent: undefined,
    doc: ITemplate,
    { models }: IContext,
  ) => {
    return models.Template.createTemplate(doc);
  },

  updateTemplate: async (
    _parent: undefined,
    { _id },
    doc: ITemplate,
    { models }: IContext,
  ) => {
    return models.Template.updateTemplate(_id, doc);
  },

  removeTemplate: async (_parent: undefined, { _id }, { models }: IContext) => {
    return models.Template.removeTemplate(_id);
  },
};
