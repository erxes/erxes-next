import { IContext } from '~/connectionResolvers';

  
export const tasksMutations = {
    createTasks: async (_parent: undefined, { name }, { models }: IContext) => {
      return models.Tasks.createTasks({name});
    },

    updateTasks: async (_parent: undefined, { _id, name }, { models }: IContext) => {
      return models.Tasks.updateTasks(_id, {name});
    },

    removeTasks: async (_parent: undefined, { _id }, { models }: IContext) => {
      return models.Tasks.removeTasks(_id);
    },
  };

