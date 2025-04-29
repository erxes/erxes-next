import { IContext } from '~/connectionResolvers';

export const classQueries = {
  courseClasses: async (_root, params, { models }: IContext) => {
    return {
      list: await models.Classes.find({
        _id: params.classId,
      }),
      totalCount: await models.Classes.find().countDocuments(),
    };
  },
};
