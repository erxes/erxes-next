import { Document, Model } from 'mongoose';


export interface IGeneralSettings {
 assistantName: string;
 conversationStarter: string;
 description: string;
 promptSuggestions: string[];
 updatedAt?: Date;
}


export interface IGeneralSettingsDocument extends IGeneralSettings, Document {
 _id: string;
 createdAt: Date;
 updatedAt: Date;
}


export interface IGeneralSettingsModel extends Model<IGeneralSettingsDocument> {
 getSettings(): Promise<IGeneralSettingsDocument | null>;
 updateSettings(doc: Partial<IGeneralSettings>): Promise<IGeneralSettingsDocument>;
}


export const generalSettingsFields = {
 assistantName: { type: String, default: '' },
 conversationStarter: { type: String, default: '' },
 description: { type: String, default: '' },
 promptSuggestions: { type: [String], default: [] },
};
