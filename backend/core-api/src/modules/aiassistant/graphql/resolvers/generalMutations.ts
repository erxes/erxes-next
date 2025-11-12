import { IGeneralSettingsDocument } from "../../db/definitions/generalSettings";
import { GeneralSettingsModel } from "../../db/models/GeneralSettings";




export interface GeneralSettingsMutationResolvers {
updateGeneralSettings: (
  _parent: any,
  args: { input: Partial<IGeneralSettingsDocument> }
) => Promise<IGeneralSettingsDocument>;
}




export const generalMutations: GeneralSettingsMutationResolvers = {
updateGeneralSettings: async (
  _parent: any,
  { input }: { input: Partial<IGeneralSettingsDocument> }
): Promise<IGeneralSettingsDocument> => {
  const existingSettings = await GeneralSettingsModel.findOne().exec();




  if (existingSettings) {
    Object.assign(existingSettings, input, { updatedAt: new Date() });
    return await existingSettings.save();
  } else {
    const newSettings = new GeneralSettingsModel({
      ...input,
      updatedAt: new Date(),
    });
    return await newSettings.save();
  }
},
};
