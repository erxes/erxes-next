import { IRelation, IRelationDocument } from 'erxes-api-shared/core-types';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { relationSchema } from '@/relations/db/definitions/relations';

export interface IRelationModel extends Model<IRelationDocument> {
  createRelation: (relation: IRelation) => Promise<IRelationDocument>;
  updateRelation: ({
    _id,
    doc,
  }: {
    _id: string;
    doc: IRelation;
  }) => Promise<IRelationDocument>;
  deleteRelation: (relation: IRelationDocument) => Promise<IRelationDocument>;
}

export const loadRelationClass = (models: IModels) => {
  class Relation {
    public static async createRelation(relation: IRelationDocument) {
      return models.Relations.create(relation);
    }

    public static async updateRelation({
      _id,
      doc,
    }: {
      _id: string;
      doc: IRelation;
    }) {
      return models.Relations.updateOne({ _id }, doc);
    }

    public static async deleteRelation({ _id }: { _id: string }) {
      return models.Relations.deleteOne({ _id });
    }

    public static async getRelationByEntity({
      entityType,
      entityId,
    }: {
      entityType: string;
      entityId: string;
    }) {
      return models.Relations.findOne({
        'entities.contentType': entityType,
        'entities.contentId': entityId,
      });
    }
  }

  relationSchema.loadClass(Relation);

  return relationSchema;
};
