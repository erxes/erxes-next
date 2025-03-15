import { IContext } from 'backend/core-api/src/connectionResolvers';

export default {
  async departmentsAdd(_root, doc, { user, models }: IContext) {
    return await models.Departments.createDepartment(doc, user);
  },

  async departmentsEdit(_root, { _id, ...doc }, { user, models }: IContext) {
    return await models.Departments.updateDepartment(_id, doc, user);
  },

  async departmentsRemove(_root, { ids }, { models }: IContext) {
    if (!ids.length) {
      throw new Error('You must specify at least one department id to remove');
    }

    return await models.Departments.removeDepartments(ids);
  },
};
