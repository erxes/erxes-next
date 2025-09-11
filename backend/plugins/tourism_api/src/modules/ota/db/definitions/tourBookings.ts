import { IOTATourBookingDocument } from '@/ota/@types/tourBookings';
import { Schema } from 'mongoose';

export const otaTourBookingSchema = new Schema<IOTATourBookingDocument>({
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
