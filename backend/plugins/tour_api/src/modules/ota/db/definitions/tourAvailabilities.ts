// definitions/tourAvailabilities.ts
import { Document, Schema } from 'mongoose';
import { mongooseStringRandomId } from 'erxes-api-shared/src/utils';

export interface IOTATourAvailability {
  tourId: string;
  startDate: Date;
  endDate: Date;
  totalSpots: number;
  availableSpots: number;
  price?: number;
}

export interface IOTATourAvailabilityDocument extends IOTATourAvailability, Document {
  _id: string;
}

export const otaTourAvailabilitySchema = new Schema<IOTATourAvailabilityDocument>({
    _id: mongooseStringRandomId,
  tourId: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalSpots: { type: Number, required: true },
  availableSpots: { type: Number, required: true },
  price: Number,
});
