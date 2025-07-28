
  import { IContext } from '~/connectionResolvers';

  export const savingMutations = {
    createSaving: async (_parent: undefined, { name }, { models }: IContext) => {
      return models.Saving.createSaving({name});
    },

    updateSaving: async (_parent: undefined, { _id, name }, { models }: IContext) => {
      return models.Saving.updateSaving(_id, {name});
    },

    removeSaving: async (_parent: undefined, { _id }, { models }: IContext) => {
      return models.Saving.removeSaving(_id);
    },
  };

