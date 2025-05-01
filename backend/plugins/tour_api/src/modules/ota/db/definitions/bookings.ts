import { Document, Schema } from 'mongoose';
import { mongooseStringRandomId } from 'erxes-api-shared/src/utils';


interface IGuest {
  name: string;
  email: string;
  age: number;
  passportNumber?: string;
}


interface IRoom {
  roomTypeId: string;
  numberOfRooms: number;
  adults: number;
  children: number;
  price: number;
}

export interface IOTABooking {
  customerId: string;
  hotelId: string;
  roomTypeId: string;
  checkIn: Date;
  checkOut: Date;
  guests: IGuest[];
  totalPrice: number;
  status?: 'confirmed' | 'cancelled' | 'pending';
  externalBookingId?: string;
  rooms: IRoom[];
  total: number
}


export interface IOTABookingDocument extends IOTABooking, Document {
  _id: string;
  createdAt: Date;
}

export const otaBookingSchema = new Schema<IOTABookingDocument>(
  {
    _id: mongooseStringRandomId,
    customerId: { type: String, required: true },
    hotelId: { type: String, required: true },
    rooms: [{ roomTypeId: String, numberOfRooms: Number, adults: Number, children: Number, price: Number }],
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: [{ name: String, email: String, age: Number, passportNumber: String }],
    totalPrice: Number,
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'pending'],
      default: 'confirmed',
    },
    total: Number,
    externalBookingId: String,
  },
  { timestamps: true }
);

otaBookingSchema.index({ hotelId: 1 });
