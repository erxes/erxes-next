
  import { IContext } from '~/connectionResolvers';

   export const leactureQueries = {
    getLeacture: async (_parent: undefined, { _id }, { models }: IContext) => {
      return models.Leacture.getLeacture(_id);
    },
    
    getLeactures: async (_parent: undefined, { models }: IContext) => {
      return models.Leacture.getLeactures();
    },
  };
