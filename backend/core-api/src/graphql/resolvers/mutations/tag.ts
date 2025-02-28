import { IContext } from 'backend/core-api/src/connectionResolvers';
import { ITag, ITagsEdit } from 'erxes-api-utils';

export const tagMutations = {
  /**
   * Creates a new tag
   */
  async tagsAdd(_root, doc: ITag, { models }: IContext) {
    const tag = await models.Tags.createTag(doc);

    return tag;
  },

  /**
   * Edits a tag
   */
  async tagsEdit(_root, { _id, ...doc }: ITagsEdit, { models }: IContext) {
    const updated = await models.Tags.updateTag(_id, doc);

    return updated;
  },

  /**
   * Removes a tag
   */
  async tagsRemove(_root, { _id }: { _id: string }, { models }: IContext) {
    const removed = await models.Tags.removeTag(_id);

    return removed;
  },

  async tagsMerge(
    _root,
    { sourceId, destId }: { sourceId: string; destId: string },
    { models }: IContext,
  ) {
    // remove old tag
    await models.Tags.removeTag(sourceId);

    return models.Tags.getTag(destId);
  },
};
