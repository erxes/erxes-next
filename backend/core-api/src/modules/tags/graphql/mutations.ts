import { ITag } from 'erxes-api-shared/core-types';
import { IContext } from '~/connectionResolvers';

export const tagMutations = {
  /**
   * Creates a new tag
   */
  async tagsAdd(_root: undefined, doc: ITag, { models, __ }: IContext) {
    return await models.Tags.createTag(__(doc));
  },

  /**
   * Edits a tag
   */
  async tagsEdit(
    _root: undefined,
    { _id, ...doc }: { _id: string } & ITag,
    { models, __ }: IContext,
  ) {
    return await models.Tags.updateTag(_id, __(doc));
  },

  /**
   * Removes a tag
   */
  async tagsRemove(
    _root: undefined,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return await models.Tags.removeTag(_id);
  },

  /**
   * Merge tags
   */
  async tagsMerge(
    _root: undefined,
    { sourceId, destId }: { sourceId: string; destId: string },
    { models }: IContext,
  ) {
    // remove old tag
    await models.Tags.removeTag(sourceId);

    return models.Tags.getTag(destId);
  },
};
