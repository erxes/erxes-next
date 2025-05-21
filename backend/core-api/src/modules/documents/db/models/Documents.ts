import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { IDocumentDocument } from '../../types';
import { documentSchema } from '../definitions/documents';

export interface IDocumentModel extends Model<IDocumentDocument> {
  saveDocument({ _id, doc }): Promise<IDocumentDocument>;
}

export const loadDocumentClass = (models: IModels) => {
  class Document {
    /**
     * Marks documents as read
     */
    public static async saveDocument({ _id, doc }) {
      if (_id) {
        return await models.Documents.findOneAndUpdate(
          { _id },
          { $set: doc },
          { new: true },
        );
      }

      return await models.Documents.create(doc);
    }
  }

  documentSchema.loadClass(Document);

  return documentSchema;
};
