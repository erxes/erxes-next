import { Schema, model, models, Model } from "mongoose";
import {
  IGeneralSettingsDocument,
  IGeneralSettingsModel,
  generalSettingsFields,
} from "~/modules/aiassistant/db/definitions/generalSettings";

export const GeneralSettingsSchema = new Schema<IGeneralSettingsDocument>(
  generalSettingsFields,
  {
    timestamps: true,
    collection: "general_settings",
  }
);

const MODEL_NAME = "GeneralSettings";

export const GeneralSettings =
  (models[MODEL_NAME] as IGeneralSettingsModel) ||
  model<IGeneralSettingsDocument, IGeneralSettingsModel>(
    MODEL_NAME,
    GeneralSettingsSchema
  );
