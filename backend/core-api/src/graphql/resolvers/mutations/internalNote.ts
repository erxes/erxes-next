import { IContext } from 'backend/core-api/src/connectionResolvers';
import {
  IInternalNote,
  IInternalNotesEdit,
} from 'backend/core-api/src/modules/internalNote/@types';

export const internalNoteMutations = {
  /**
   * Adds internalNote object and also adds an activity log
   */
  async internalNotesAdd(
    _root,
    args: IInternalNote,
    { user, models }: IContext,
  ) {
    const internalNote = await models.InternalNotes.createInternalNote(
      args,
      user,
    );

    return internalNote;
  },

  /**
   * Updates internalNote object
   */
  async internalNotesEdit(
    _root,
    { _id, ...doc }: IInternalNotesEdit,
    { models }: IContext,
  ) {
    const updated = await models.InternalNotes.updateInternalNote(_id, doc);

    return updated;
  },

  /**
   * Removes an internal note
   */
  async internalNotesRemove(
    _root,
    { _id }: { _id: string },
    { models }: IContext,
  ) {
    const removed = await models.InternalNotes.removeInternalNote(_id);

    return removed;
  },
};
