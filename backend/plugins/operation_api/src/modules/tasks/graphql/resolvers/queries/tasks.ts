
  import { IContext } from '~/connectionResolvers';

   export const tasksQueries = {
    getTasks: async (_parent: undefined, { _id }, { models }: IContext) => {
      return models.Tasks.getTasks(_id);
    },
    
    getTaskss: async (_parent: undefined, { models }: IContext) => {
      return models.Tasks.getTaskss();
    },
  };
