import { Document, Mongoose, Schema } from 'mongoose';
import { mongooseStringRandomId } from 'erxes-api-shared/src/utils';

export interface IOTATourBooking {
  tourId: String;
  customerId: string;

  spots: number;
  status: 'confirmed' | 'cancelled';
  bookedAt?: Date;
}

export interface IOTATourBookingDocument extends IOTATourBooking, Document {
  _id: string;
}

export const otaTourBookingSchema = new Schema<IOTATourBookingDocument>({
  _id: mongooseStringRandomId,
  tourId: { type: String, required: true },
  customerId: { type: String, required: true },

  spots: { type: Number, required: true },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed',
  },
  bookedAt: { type: Date, default: Date.now },
});
