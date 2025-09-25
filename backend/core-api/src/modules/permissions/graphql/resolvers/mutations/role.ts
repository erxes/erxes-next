import { IRole } from 'erxes-api-shared/core-types';
import { IContext } from '~/connectionResolvers';

export const roleMutations = {
  async rolesAdd(_root: undefined, doc: IRole, { models, user }: IContext) {
    return await models.Roles.createRole(doc, user);
  },

  async rolesEdit(_root: undefined, doc: IRole, { models, user }: IContext) {
    return await models.Roles.updateRole(doc, user);
  },
};
