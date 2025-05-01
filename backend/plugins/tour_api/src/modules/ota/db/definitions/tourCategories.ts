import { Document, Schema } from 'mongoose';
import { mongooseStringRandomId } from 'erxes-api-shared/src/utils';

export interface IOTATourCategory {
  name: string;
  description?: string;
  slug?: string;
}

export interface IOTATourCategoryDocument extends IOTATourCategory, Document {
    _id: string
}

export const otaTourCategorySchema = new Schema<IOTATourCategoryDocument>({
  _id: mongooseStringRandomId,
  name: { type: String, required: true },
  description: String,
  slug: { type: String, unique: true }
});
