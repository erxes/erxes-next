import { FilterQuery, Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { noteSchema } from '@/note/db/definitions/note';
import { INote, INoteDocument } from '@/note/types';

export interface INoteModel extends Model<INoteDocument> {
  getNote(_id: string): Promise<INoteDocument>;
  getNotes(filter: FilterQuery<INoteDocument>): Promise<INoteDocument[]>;
  createNote(doc: INote): Promise<INoteDocument>;
  updateNote(_id: string, doc: INote): Promise<INoteDocument>;
  removeNote({ _id }: { _id: string }): Promise<{ ok: number }>;
}

export const loadNoteClass = (models: IModels) => {
  class Note {
    public static async getNote(_id: string) {
      const Note = await models.Note.findOne({ _id }).lean();

      if (!Note) {
        throw new Error('Note not found');
      }

      return Note;
    }

    public static async getNotes(
      filter: FilterQuery<INoteDocument>,
    ): Promise<INoteDocument[]> {
      return models.Note.find(filter).lean();
    }

    public static async createNote(doc: INote): Promise<INoteDocument> {
      return models.Note.create(doc);
    }

    public static async updateNote({ _id }: { _id: string }, doc: INote) {
      return await models.Note.findOneAndUpdate({ _id }, { $set: { ...doc } });
    }

    public static async removeNote({
      _id,
      userId,
    }: {
      _id: string;
      userId: string;
    }) {
      const note = await models.Note.findOne({ _id });

      if (!note) {
        throw new Error('Note not found');
      }

      if (note.userId !== userId) {
        throw new Error('You are not authorized to remove this note');
      }

      return models.Note.deleteOne({ _id });
    }
  }

  return noteSchema.loadClass(Note);
};
