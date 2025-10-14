import { Schema, model, Model } from "mongoose";
import {
 IGeneralSettingsDocument,
 IGeneralSettingsModel,
 generalSettingsFields,
} from "../definitions/generalSettings";


export const GeneralSettingsSchema = new Schema<IGeneralSettingsDocument>(
 generalSettingsFields,
 {
   timestamps: true,
   collection: 'general_settings'
 }
);


// Create the model with proper typing
export const GeneralSettingsModel = model<IGeneralSettingsDocument, IGeneralSettingsModel>(
 "general_settings",
 GeneralSettingsSchema
)
