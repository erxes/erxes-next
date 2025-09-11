import { IOTATourDocument } from '@/ota/@types/tours';
import { Schema } from 'mongoose';

export const otaTourSchema = new Schema<IOTATourDocument>({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  categoryId: { type: String, required: true },
  duration: String,
  images: [String],
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  visits: { type: Number, default: 0 },
});
