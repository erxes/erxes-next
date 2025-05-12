import { Model } from 'mongoose';
import { IModels } from '../connectionResolvers';
import {
  automationSchema,
  IAutomationDocument,
} from '../definitions/automations';

export interface IAutomationModel extends Model<IAutomationDocument> {
  getAutomation(_id: string): IAutomationDocument;
}

export const loadClass = (models: IModels) => {
  class Automation {
    public static async getAutomation(_id) {
      return models.Automations.findOne({ _id }).lean();
    }
  }

  automationSchema.loadClass(Automation);

  return automationSchema;
};
