import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { internalNoteSchema } from '~/modules/internalNote/db/definitions/internalNote';
import {
  IInternalNote,
  IInternalNoteDocument,
} from '~/modules/internalNote/types';

export interface IInternalNoteModel extends Model<IInternalNoteDocument> {
  getInternalNote(_id: string): Promise<IInternalNoteDocument>;
  createInternalNote(
    { contentType, contentTypeId, ...fields }: IInternalNote,
    user,
  ): Promise<IInternalNoteDocument>;
  updateInternalNote(
    _id: string,
    doc: IInternalNote,
  ): Promise<IInternalNoteDocument>;
  removeInternalNote(_id: string): Promise<IInternalNoteDocument>;
  removeInternalNotes(
    contentType: string,
    contentTypeIds: string[],
  ): Promise<{ n: number; ok: number }>;
}

export const loadInternalNoteClass = (models: IModels) => {
  class InternalNote {
    public static async getInternalNote(_id: string) {
      const internalNote = await models.InternalNotes.findOne({ _id }).lean();

      if (!internalNote) {
        throw new Error('Internal note not found');
      }

      return internalNote;
    }

    /*
     * Create new internalNote
     */
    public static async createInternalNote(
      { contentType, contentTypeId, ...fields }: IInternalNote,
      user,
    ) {
      return await models.InternalNotes.create({
        contentType,
        contentTypeId,
        createdUserId: user._id,
        ...fields,
      });
    }

    /*
     * Update internalNote
     */
    public static async updateInternalNote(_id: string, doc: IInternalNote) {
      return models.InternalNotes.findOneAndUpdate(
        { _id },
        { $set: doc },
        { new: true },
      );
    }

    /*
     * Remove internalNote
     */
    public static async removeInternalNote(_id: string) {
      const internalNoteObj = await models.InternalNotes.findOneAndDelete({
        _id,
      });

      if (!internalNoteObj) {
        throw new Error(`InternalNote not found with id ${_id}`);
      }

      return internalNoteObj;
    }

    /**
     * Remove internal notes
     */
    public static async removeInternalNotes(
      contentType: string,
      contentTypeIds: string[],
    ) {
      // Removing every internal notes of contentType
      return models.InternalNotes.deleteMany({
        contentType,
        contentTypeId: { $in: contentTypeIds },
      });
    }
  }

  internalNoteSchema.loadClass(InternalNote);

  return internalNoteSchema;
};
