import { IContext } from '~/connectionResolvers';
import { INoteDocument } from '~/modules/note/types';

export const noteMutations = {
  createNote: async (
    _parent: undefined,
    { content, itemId, mentions },
    { models, user, subdomain }: IContext,
  ) => {
    return models.Note.createNote({
      doc: {
        content,
        itemId,
        mentions,
        createdBy: user._id,
      },
      subdomain,
    });
  },

  updateNote: async (
    _parent: undefined,
    params: INoteDocument,
    { models }: IContext,
  ) => {
    return models.Note.updateNote(params);
  },

  deleteNote: async (
    _parent: undefined,
    { _id }: { _id: string },
    { models, user }: IContext,
  ) => {
    return models.Note.removeNote({ _id, userId: user._id });
  },
};
