import { IGeneralSettings, IGeneralSettingsDocument } from "~/modules/aiassistant/db/definitions/generalSettings";
import { GeneralSettingsModel } from "~/modules/aiassistant/db/models/GeneralSettings";

export const getGeneralSettings = async (): Promise<IGeneralSettingsDocument | null> => {
  return await GeneralSettingsModel.findOne().exec();
};


export const updateGeneralSettings = async (
  input: Partial<IGeneralSettings>
): Promise<IGeneralSettingsDocument> => {
  const existingSettings = await GeneralSettingsModel.findOne().exec();

  if (existingSettings) {
    existingSettings.set({
      ...input,
      updatedAt: new Date(),
    });
    return await existingSettings.save();
  } else {
    const newSettings = new GeneralSettingsModel({
      ...input,
      updatedAt: new Date(),
    });
    return await newSettings.save();
  }
};