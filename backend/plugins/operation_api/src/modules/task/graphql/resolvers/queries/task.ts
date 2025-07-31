
  import { IContext } from '~/connectionResolvers';

   export const taskQueries = {
    getTask: async (_parent: undefined, { _id }, { models }: IContext) => {
      return models.Task.getTask(_id);
    },
    
    getTasks: async (_parent: undefined, { models }: IContext) => {
      return models.Task.getTasks();
    },
  };
