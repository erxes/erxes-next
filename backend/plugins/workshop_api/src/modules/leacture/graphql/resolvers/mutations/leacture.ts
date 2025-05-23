
  import { IContext } from '~/connectionResolvers';

  export const leactureMutations = {
    createLeacture: async (_parent: undefined, { name }, { models }: IContext) => {
      return models.Leacture.createLeacture({name});
    },

    updateLeacture: async (_parent: undefined, { _id, name }, { models }: IContext) => {
      return models.Leacture.updateLeacture(_id, {name});
    },

    removeLeacture: async (_parent: undefined, { _id }, { models }: IContext) => {
      return models.Leacture.removeLeacture(_id);
    },
  };

