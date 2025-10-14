import { IModels } from '~/connectionResolvers';
import { GeneralSettingsModel } from './GeneralSettings';
import { IGeneralSettingsDocument, IGeneralSettingsModel } from '../definitions/generalSettings';


export const loadGeneralSettingsClass = (models: IModels) => {
 class GeneralSettings {
   // Example static method
   public static async getSettings(): Promise<IGeneralSettingsDocument | null> {
     return models.GeneralSettings.findOne({});
   }


   // You can add more static methods here
 }


 // Attach class methods to the existing model's schema
 GeneralSettingsModel.schema.loadClass(GeneralSettings);


 return GeneralSettingsModel;
};
