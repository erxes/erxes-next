import {
  checkPermission,
  requireLogin,
} from 'erxes-api-shared/core-modules';

import { IContext } from '~/connectionResolvers';

const mutations = {
  /**
   * Cms tag add
   */
  cmsTagsAdd: async (
    _parent: any,
    args: any,
    context: IContext,
  ): Promise<any> => {
    const { models, clientPortalId } = context;
    const { input } = args;

    if (clientPortalId) {
      input.clientPortalId = clientPortalId;
    }

    return models.PostTags.createTag(input);
  },

  /**
   * Cms tag edit
   */
  cmsTagsEdit: async (
    _parent: any,
    args: any,
    context: IContext,
  ): Promise<any> => {
    const { models } = context;
    const { _id, input } = args;

    return models.PostTags.updateTag(_id, input);
  },

  /**
   * Cms tag remove
   */
  cmsTagsRemove: async (
    _parent: any,
    args: any,
    context: IContext,
  ): Promise<any> => {
    const { models } = context;
    const { _id } = args;

    return models.PostTags.deleteOne({ _id });
  },

  /**
   * Cms tag toggle status
   */
  cmsTagsToggleStatus: async (
    _parent: any,
    args: any,
    context: IContext,
  ): Promise<any> => {
    const { models } = context;
    const { _id } = args;

    return models.PostTags.toggleStatus(_id);
  },
};

requireLogin(mutations, 'cmsTagsAdd');
requireLogin(mutations, 'cmsTagsEdit');
requireLogin(mutations, 'cmsTagsRemove');
requireLogin(mutations, 'cmsTagsToggleStatus');

checkPermission(mutations, 'cmsTagsAdd', 'manageCms', []);
checkPermission(mutations, 'cmsTagsEdit', 'manageCms', []);
checkPermission(mutations, 'cmsTagsRemove', 'manageCms', []);
checkPermission(mutations, 'cmsTagsToggleStatus', 'manageCms', []);

export default mutations;
