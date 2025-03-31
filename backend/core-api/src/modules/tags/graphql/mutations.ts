import { IContext } from 'backend/core-api/src/@types';
import { ITag } from 'erxes-core-types';

export const tagMutations = {
  /**
   * Creates a new tag
   */
  async tagsAdd(_root: undefined, doc: ITag, { models }: IContext) {
    return await models.Tags.createTag(doc);
  },

  /**
   * Edits a tag
   */
  async tagsEdit(
    _root: undefined,
    { _id, ...doc }: { _id: string } & ITag,
    { models }: IContext,
  ) {
    return await models.Tags.updateTag(_id, doc);
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
