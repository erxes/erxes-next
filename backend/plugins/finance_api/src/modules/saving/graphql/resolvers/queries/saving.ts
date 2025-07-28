
  import { IContext } from '~/connectionResolvers';

   export const savingQueries = {
    getSaving: async (_parent: undefined, { _id }, { models }: IContext) => {
      return models.Saving.getSaving(_id);
    },
    
    getSavings: async (_parent: undefined, { models }: IContext) => {
      return models.Saving.getSavings();
    },
  };
