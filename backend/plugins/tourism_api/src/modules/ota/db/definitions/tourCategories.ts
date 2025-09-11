import { IOTATourCategoryDocument } from '@/ota/@types/tourCategories';
import { Schema } from 'mongoose';

export const otaTourCategorySchema = new Schema<IOTATourCategoryDocument>({
  name: { type: String, required: true },
  description: String,
  slug: { type: String, unique: true },
});
