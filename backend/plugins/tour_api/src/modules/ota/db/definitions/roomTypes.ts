import { Document, Schema } from 'mongoose';
import { mongooseStringRandomId } from 'erxes-api-shared/src/utils';

export interface IOTARoomType {
  hotelId: string;
  externalRoomTypeId?: string;
  name: string;
  description?: string;
  capacity?: number;
  price?: number;
  photos?: string[];
  isAvailable?: boolean;
  isSmoking?: boolean;
  isPetsAllowed?: boolean;
  isWheelchairAccessible?: boolean;
  isKidsFree?: boolean;
  size?: string;
  amenities?: string[];
  bedType?: string;
}

export interface IOTARoomTypeDocument extends IOTARoomType, Document {
  _id: string;
  createdAt: Date;
}

export const otaRoomTypeSchema = new Schema<IOTARoomTypeDocument>(
  {
    _id: mongooseStringRandomId,
    hotelId: { type: String, required: true },
    externalRoomTypeId: String,
    name: { type: String, required: true },
    description: String,
    capacity: Number,
    price: Number,
    photos: [String],
    isAvailable: { type: Boolean, default: true },
    isSmoking: { type: Boolean, default: false },
    isPetsAllowed: { type: Boolean, default: false },
    isWheelchairAccessible: { type: Boolean, default: false },
    isKidsFree: { type: Boolean, default: false },
    size: String,
    amenities: [String],
    bedType: String,
  },
  { timestamps: true }
);

otaRoomTypeSchema.index({ hotelId: 1 });
