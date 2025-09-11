import { IOTATourAvailabilityDocument } from '@/ota/@types/tourAvailabilities';
import { Schema } from 'mongoose';

export const otaTourAvailabilitySchema =
  new Schema<IOTATourAvailabilityDocument>({
    tourId: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalSpots: { type: Number, required: true },
    availableSpots: { type: Number, required: true },
    price: Number,
  });
