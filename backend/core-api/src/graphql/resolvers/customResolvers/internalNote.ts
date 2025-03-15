import { IContext } from 'backend/core-api/src/connectionResolvers';
import { IInternalNoteDocument } from 'backend/core-api/src/modules/internalNote/@types';

export default {
  async createdUser(note: IInternalNoteDocument, _args, { models }: IContext) {
    // return models.Users.findOne({ _id: note.createdUserId });
  },
};
