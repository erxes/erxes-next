import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import { IChecklist, IChecklistDocument } from '../../@types/checklist';
import { IChecklistItem, IChecklistItemDocument } from '../../@types/checklist';
import { IUserDocument } from 'erxes-api-shared/core-types';
import { checklistSchema } from '../definitions/checklists';
import { checklistItemSchema } from '../definitions/checklists';

export interface IChecklistModel extends Model<IChecklistDocument> {
  getChecklist(_id: string): Promise<IChecklistDocument>;
  removeChecklists(contentType: string, contentTypeIds: string[]): Promise<void>;
  createChecklist(
    doc: IChecklist,
    user: IUserDocument
  ): Promise<IChecklistDocument>;
  updateChecklist(_id: string, doc: IChecklist): Promise<IChecklistDocument>;
  removeChecklist(_id: string): Promise<IChecklistDocument>;
}

export const loadChecklistClass = (models: IModels ) => {
  class Checklist {
    public static async getChecklist(_id: string) {
      const checklist = await models.Checklists.findOne({ _id });

      if (!checklist) {
        throw new Error('Checklist not found');
      }

      return checklist;
    }

    public static async removeChecklists(
      contentType: string,
      contentTypeIds: string[]
    ) {
      const checklists = await models.Checklists.find({
        contentType,
        contentTypeId: { $in: contentTypeIds },
      });

      if (checklists.length === 0) return;

      const checklistIds = checklists.map(list => list._id);

      await models.ChecklistItems.deleteMany({
        checklistId: { $in: checklistIds },
      });

      await models.Checklists.deleteMany({ _id: { $in: checklistIds } });
    }

    public static async createChecklist(
      { contentType, contentTypeId, ...fields }: IChecklist,
      user: IUserDocument
    ) {
      return models.Checklists.create({
        contentType,
        contentTypeId,
        createdUserId: user._id,
        createdDate: new Date(),
        ...fields,
      });
    }

    public static async updateChecklist(_id: string, doc: IChecklist) {
      await models.Checklists.updateOne({ _id }, { $set: doc });
      return models.Checklists.findOne({ _id });
    }

    public static async removeChecklist(_id: string) {
      const checklist = await models.Checklists.findOne({ _id });
      if (!checklist) {
        throw new Error(`Checklist not found with id ${_id}`);
      }

      await models.ChecklistItems.deleteMany({ checklistId: _id });
      await checklist.deleteOne();
      return checklist;
    }
  }

  checklistSchema.loadClass(Checklist);
  return checklistSchema;
};

export interface IChecklistItemModel extends Model<IChecklistItemDocument> {
  getChecklistItem(_id: string): Promise<IChecklistItemDocument>;
  createChecklistItem(
    doc: IChecklistItem,
    user: IUserDocument
  ): Promise<IChecklistItemDocument>;
  updateChecklistItem(
    _id: string,
    doc: IChecklistItem
  ): Promise<IChecklistItemDocument>;
  removeChecklistItem(_id: string): Promise<IChecklistItemDocument>;
  updateItemOrder(
    _id: string,
    destinationOrder: number
  ): Promise<IChecklistItemDocument>;
}

export const loadChecklistItemClass = (models: IModels) => {
  class ChecklistItem {
    public static async getChecklistItem(_id: string) {
      const item = await models.ChecklistItems.findOne({ _id });
      if (!item) throw new Error('Checklist item not found');
      return item;
    }

    public static async createChecklistItem(
      { checklistId, ...fields }: IChecklistItem,
      user: IUserDocument
    ) {
      const itemCount = await models.ChecklistItems.countDocuments({ checklistId });
      return models.ChecklistItems.create({
        checklistId,
        createdUserId: user._id,
        createdDate: new Date(),
        order: itemCount + 1,
        ...fields,
      });
    }

    public static async updateChecklistItem(_id: string, doc: IChecklistItem) {
      await models.ChecklistItems.updateOne({ _id }, { $set: doc });
      return models.ChecklistItems.findOne({ _id });
    }

    public static async removeChecklistItem(_id: string) {
      const item = await models.ChecklistItems.findOneAndDelete({ _id });
      if (!item) throw new Error(`Checklist item not found with id ${_id}`);
      return item;
    }

    public static async updateItemOrder(_id: string, destinationOrder: number) {
      const currentItem = await models.ChecklistItems.findOne({ _id }).lean();
      if (!currentItem) {
        throw new Error(`Checklist item _id = ${_id} not found`);
      }

      await models.ChecklistItems.updateOne(
        { 
          checklistId: currentItem.checklistId, 
          order: destinationOrder 
        },
        { $set: { order: currentItem.order } }
      );

      await models.ChecklistItems.updateOne(
        { _id },
        { $set: { order: destinationOrder } }
      );

      return models.ChecklistItems.findOne({ _id }).lean();

    }
  }

  // Assuming you have a checklistItemSchema defined elsewhere
  checklistItemSchema.loadClass(ChecklistItem);
  return checklistItemSchema;
};


