import { Document, Model } from 'mongoose';

export interface IModels {
  // Add your model interfaces here
}

export interface IModelParams {
  // Add your model parameters here
}

export interface IModelDocument extends Document {
  // Add your document interfaces here
}

export interface IModelModel extends Model<IModelDocument> {
  // Add your model methods here
}
