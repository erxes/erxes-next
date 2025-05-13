import { IContext } from '~/connectionResolvers';
import { IClass } from '@/class/@types/classes';

export const classMutations = {
  classAdd: async (_root, doc: IClass, { models }: IContext) => {
    const courseClass = await models.Classes.createClass(doc);

    return courseClass;
  },
  /**
   *
   */
  classEdit: async (
    _root,
    { _id, ...doc }: { _id: string } & IClass,
    { models }: IContext,
  ) => {
    const courseClass = await models.Classes.updateClass(_id, doc);

    return courseClass;
  },
  //
  classesRemove: async (
    _root,
    { classIds }: { classIds: string[] },
    { models }: IContext,
  ) => {
    await models.Classes.removeClasses(classIds);

    return classIds;
  },
};
