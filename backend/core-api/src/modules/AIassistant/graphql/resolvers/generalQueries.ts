import { IGeneralSettingsDocument } from "../../db/definitions/generalSettings";
import { GeneralSettingsModel } from "../../db/models/GeneralSettings";

export interface GeneralSettingsQueryResolvers {
getGeneralSettings: () => Promise<IGeneralSettingsDocument | null>;
}

export const generalQueries: GeneralSettingsQueryResolvers = {
  getGeneralSettings: async (): Promise<IGeneralSettingsDocument | null> => {
    return await GeneralSettingsModel.findOne().exec();
  },
};

