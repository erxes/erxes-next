import { IContext } from '~/connectionResolvers';

export const studentMutations = {
  studentRemove: async (
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    await models.Students.deleteStudent(_id);

    return _id;
  },
};
