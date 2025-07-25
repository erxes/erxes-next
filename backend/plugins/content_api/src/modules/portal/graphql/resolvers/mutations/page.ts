import {
  checkPermission,
  requireLogin,
} from 'erxes-api-shared/core-modules';

import { IContext } from '~/connectionResolvers';

const mutations = {
  /**
   * Cms page add
   */
  cmsPagesAdd: async (
    _parent: any,
    args: any,
    context: IContext,
  ): Promise<any> => {
    const { models, user, clientPortalId } = context;
    const { input } = args;
    input.createdUserId = user._id;

    if (clientPortalId) {
      input.clientPortalId = clientPortalId;
    }

    return models.Pages.createPage(input);
  },

  /**
   * Cms page edit
   */
  cmsPagesEdit: async (
    _parent: any,
    args: any,
    context: IContext,
  ): Promise<any> => {
    const { models, clientPortalId } = context;
    const { _id, input } = args;

    if (clientPortalId) {
      input.clientPortalId = clientPortalId;
    }

    return models.Pages.updatePage(_id, input);
  },

  /**
   * Cms page delete
   */
  cmsPagesRemove: async (
    _parent: any,
    args: any,
    context: IContext,
  ): Promise<any> => {
    const { models } = context;
    const { _id } = args;

    return models.Pages.deleteOne({ _id });
  },
};

requireLogin(mutations, 'cmsPagesAdd');
requireLogin(mutations, 'cmsPagesEdit');
requireLogin(mutations, 'cmsPagesRemove');

checkPermission(mutations, 'cmsPagesAdd', 'manageCms', []);
checkPermission(mutations, 'cmsPagesEdit', 'manageCms', []);
checkPermission(mutations, 'cmsPagesRemove', 'manageCms', []);

export default mutations;
