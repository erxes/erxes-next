import { IModels } from 'backend/core-api/src/connectionResolvers';
import { IOrderInput } from '../../../modules/@types/common';
import {
  IFieldGroup,
  IFieldGroupDocument,
} from '../../../modules/properties/@types';
import { Model } from 'mongoose';
import { fieldGroupSchema } from '../../definitions/properties/fieldGroup';

export interface IFieldGroupModel extends Model<IFieldGroupDocument> {
  checkCodeDuplication(code: string): string;
  checkIsDefinedByErxes(_id: string): never;

  createGroup(doc: IFieldGroup): Promise<IFieldGroupDocument>;
  updateGroup(_id: string, doc: IFieldGroup): Promise<IFieldGroupDocument>;
  removeGroup(_id: string): Promise<string>;
  updateOrder(orders: IOrderInput[]): Promise<IFieldGroupDocument[]>;
}

export const loadGroupClass = (models: IModels) => {
  class FieldGroup {
    static async checkCodeDuplication(code: string) {
      const group = await models.FieldsGroups.findOne({
        code,
      });

      if (group) {
        throw new Error('Code must be unique');
      }
    }
    /*
     * Check if Group is defined by erxes by default
     */
    public static async checkIsDefinedByErxes(_id: string) {
      const groupObj = await models.FieldsGroups.findOne({ _id });

      // Checking if the group is defined by the erxes
      if (groupObj?.isDefinedByErxes) {
        throw new Error('Cant update this group');
      }
    }

    /*
     * Create new field group
     */
    public static async createGroup(doc: IFieldGroup) {
      if (doc.code) {
        await this.checkCodeDuplication(doc.code || '');
      }

      // Newly created group must be visible
      const isVisible = true;

      const { contentType } = doc;

      // Automatically setting order of group to the bottom
      let order = 1;

      const lastGroup = await models.FieldsGroups.findOne({ contentType }).sort(
        {
          order: -1,
        },
      );

      if (lastGroup) {
        order = (lastGroup.order || 0) + 1;
      }

      return models.FieldsGroups.create({
        ...doc,
        isVisible,
        order,
        isDefinedByErxes: false,
      });
    }

    /*
     * Update field group
     */
    public static async updateGroup(_id: string, doc: IFieldGroup) {
      const group = await models.FieldsGroups.findOne({ _id });

      if (doc.code && group && group.code !== doc.code) {
        await this.checkCodeDuplication(doc.code);
      }

      // Can not edit group that is defined by erxes
      await this.checkIsDefinedByErxes(_id);

      await models.FieldsGroups.updateOne({ _id }, { $set: doc });

      return models.FieldsGroups.findOne({ _id });
    }

    /**
     * Remove field group
     */
    public static async removeGroup(_id: string) {
      const groupObj = await models.FieldsGroups.findOne({ _id });

      if (!groupObj) {
        throw new Error(`Group not found with id of ${_id}`);
      }

      // Can not delete group that is defined by erxes
      await this.checkIsDefinedByErxes(_id);

      // Deleting fields that are associated with this group
      const fields = await models.Fields.find({ groupId: _id });

      for (const field of fields) {
        models.Fields.removeField(field._id);
      }

      await groupObj.deleteOne();

      return _id;
    }
  }

  fieldGroupSchema.loadClass(FieldGroup);

  return fieldGroupSchema;
};
