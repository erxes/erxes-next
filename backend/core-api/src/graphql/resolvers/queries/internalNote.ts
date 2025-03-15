import { IContext } from 'backend/core-api/src/connectionResolvers';

export const internalNoteQueries = {
  async internalNoteDetail(
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    return models.InternalNotes.findOne({ _id });
  },
  /**
   * InternalNotes list
   */
  async internalNotes(
    _root,
    {
      contentType,
      contentTypeId,
    }: { contentType: string; contentTypeId: string },
    { models }: IContext,
  ) {
    return models.InternalNotes.find({ contentType, contentTypeId }).sort({
      createdDate: 1,
    });
  },

  async internalNotesAsLogs(
    _root,
    { contentTypeId }: { contentTypeId: string },
    { models }: IContext,
  ) {
    const notes = await models.InternalNotes.find({ contentTypeId })
      .sort({ createdAt: -1 })
      .lean();

    // convert to activityLog schema
    return notes.map((n) => ({
      ...n,
      contentId: contentTypeId,
      contentType: 'note',
    }));
  },
};
