import { IRelation, IRelationDocument } from 'erxes-api-shared/core-types';
import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { relationSchema } from '@/relations/db/definitions/relations';

export interface IRelationModel extends Model<IRelationDocument> {
  createRelation: ({
    relation,
  }: {
    relation: IRelation;
  }) => Promise<IRelationDocument>;
  updateRelation: ({
    _id,
    doc,
  }: {
    _id: string;
    doc: IRelation;
  }) => Promise<IRelationDocument>;
  deleteRelation: ({ _id }: { _id: string }) => Promise<IRelationDocument>;
  getRelationsByEntity: ({
    entityType,
    entityId,
  }: {
    entityType: string;
    entityId: string;
  }) => Promise<IRelationDocument[]>;
  getRelationsByEntities: ({
    entityTypes,
    entityIds,
  }: {
    entityTypes: string[];
    entityIds: string[];
  }) => Promise<IRelationDocument[]>;
}

export const loadRelationClass = (models: IModels) => {
  class Relation {
    public static async createRelation({ relation }: { relation: IRelation }) {
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

    public static async getRelationsByEntity({
      entityType,
      entityId,
    }: {
      entityType: string;
      entityId: string;
    }) {
      return models.Relations.find({
        'entities.contentType': entityType,
        'entities.contentId': entityId,
      });
    }

    public static async getRelationsByEntities({
      entityTypes,
      entityIds,
    }: {
      entityTypes: string[];
      entityIds: string[];
    }) {
      return models.Relations.find({
        'entities.contentType': { $in: entityTypes },
        'entities.contentId': { $in: entityIds },
      });
    }
  }

  relationSchema.loadClass(Relation);

  return relationSchema;
};
