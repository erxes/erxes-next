import { IModels } from 'backend/core-api/src/connectionResolvers';
import { IField, IFieldDocument } from '../../../modules/properties/@types';
import { Model } from 'mongoose';
import { fieldSchema } from '../../definitions/properties/field';

export interface IFieldModel extends Model<IFieldDocument> {
  checkCodeDuplication(code: string): string;
  checkIsDefinedByErxes(_id: string): never;

  createField(doc: IField): Promise<IFieldDocument>;
  updateField(_id: string, doc: IField): Promise<IFieldDocument>;
  removeField(_id: string): void;
}

export const loadFieldClass = (models: IModels) => {
  class Field {
    static async checkCodeDuplication(code: string) {
      const group = await models.Fields.findOne({
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
      const fieldObj = await models.Fields.findOne({ _id });

      // Checking if the field is defined by the erxes
      if (fieldObj?.isDefinedByErxes) {
        throw new Error('Cant update this field');
      }
    }
    /*
     * Create new field
     */
    public static async createField({
      contentType,
      contentTypeId,
      groupId,
      ...fields
    }: IField) {
      if (fields.code) {
        await this.checkCodeDuplication(fields.code || '');
      }

      const query: { [key: string]: any } = { contentType };

      if (groupId) {
        query.groupId = groupId;
      }

      if (contentTypeId) {
        query.contentTypeId = contentTypeId;
      }

      // Generate order
      // if there is no field then start with 0
      let order = 0;

      const lastField = await models.Fields.findOne(query).sort({ order: -1 });

      if (lastField) {
        order = (lastField.order || 0) + 1;
      }

      return models.Fields.create({
        contentType,
        contentTypeId,
        order,
        groupId,
        isDefinedByErxes: false,
        ...fields,
      });
    }

    /*
     * Update field
     */
    public static async updateField(_id: string, doc: IField) {
      await this.checkIsDefinedByErxes(_id);

      const field = await models.Fields.findOne({ _id });

      if (!field) {
        throw new Error('Field not found');
      }

      if (doc.code && field.code !== doc.code) {
        await this.checkCodeDuplication(doc.code);
      }

      await models.Fields.updateOne({ _id }, { $set: doc });

      return models.Fields.findOne({ _id });
    }

    /*
     * Remove field
     */
    public static async removeField(_id: string) {
      const fieldObj = await models.Fields.findOne({ _id });

      if (!fieldObj) {
        throw new Error(`Field not found with id ${_id}`);
      }

      await this.checkIsDefinedByErxes(_id);

      // Removing field value from customer

      await models.Customers.updateMany(
        { 'customFieldsData.field': _id },
        { $pull: { customFieldsData: { field: _id } } },
      );

      // Removing form associated field
      await models.Fields.updateMany(
        { associatedFieldId: _id },
        { $unset: { associatedFieldId: '' } },
      );

      await fieldObj.deleteOne();
      return fieldObj;
    }
  }

  fieldSchema.loadClass(Field);

  return fieldSchema;
};
