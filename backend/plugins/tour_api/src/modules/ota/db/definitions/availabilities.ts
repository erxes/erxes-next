import { mongooseStringRandomId } from 'erxes-api-shared/src/utils';
import { Document, Schema } from 'mongoose';

export interface IAvailability {
  roomTypeId: string; // Reference to the room type
  date: string; // The date for the availability
  availableRooms: number; // Number of rooms available on that date
  price: number; // Price for the room on that date
}

export interface IAvailabilityDocument extends IAvailability, Document {
  _id: string;
  createdAt: Date;
}

export const availabilitySchema = new Schema<IAvailabilityDocument>(
  {
    _id: mongooseStringRandomId,
    roomTypeId: { type: String, required: true }, // Foreign key for the room type
    date: { type: String, required: true }, // The date for the availability
    availableRooms: { type: Number, required: true }, // Available rooms on this date
    price: { type: Number, required: true }, // Price of the room for this date
  },
  { timestamps: true }
);
