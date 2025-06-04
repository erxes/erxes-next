import { IContext } from '~/connectionResolvers';
import { ITeacher } from '@/teachers/@types/teachers';

export const teacherMutations = {
  teacherAdd: async (_root, doc: ITeacher, { models }: IContext) => {
    return await models.Teachers.createTeacher(doc);
  },
  teacherRemove: async (
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) => {
    await models.Teachers.deleteTeacher(_id);

    return _id;
  },
};
