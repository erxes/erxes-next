
import { Document, Schema } from 'mongoose';
import { mongooseStringRandomId } from 'erxes-api-shared/src/utils';

export interface IOTATour {
  title: string;
  description?: string;
  price: number;
  categoryId?: string;
  duration?: string;
  images?: string[];
  isPublished?: boolean;
  createdAt?: Date;
  visits?: number;
}

export interface IOTATourDocument extends IOTATour, Document {
    _id: string
}

export const otaTourSchema = new Schema<IOTATourDocument>({
    _id: mongooseStringRandomId,
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

