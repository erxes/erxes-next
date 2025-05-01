import { Document, Schema } from 'mongoose';
import { mongooseStringRandomId } from 'erxes-api-shared/src/utils';

export interface IOTALocation {
  country?: string;
  city?: string;
  address?: string;
  lat?: number;
  lng?: number;
}

export interface IPolicy {
  checkIn: string;
  checkOut: string;
  cancellationPolicy: string;
}

export interface IOTAHotel {
  saasOrgId: string;
  externalHotelId?: string;
  name: string;
  description?: string;
  location?: IOTALocation;
  amenities?: string[];
  photos?: string[];
  isPublished?: boolean;
  policy: IPolicy;

  visits?: number;
}

export interface IOTAHotelDocument extends IOTAHotel, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

const locationSchema = new Schema<IOTALocation>(
  {
    country: String,
    city: String,
    address: String,
    lat: Number,
    lng: Number,
  },
  { _id: false }
);

export const otaHotelSchema = new Schema<IOTAHotelDocument>(
  {
    _id: mongooseStringRandomId,
    saasOrgId: { type: String, required: true },
    externalHotelId: String,
    name: { type: String, required: true },
    description: String,
    location: locationSchema,
    amenities: [String],
    photos: [String],
    isPublished: { type: Boolean, default: false },
    policy: {
      checkIn: String,
      checkOut: String,
      cancellationPolicy: String,
    },
    visits: { type: Number, default: 0 },
  },
  { timestamps: true }
);

otaHotelSchema.index({ saasOrgId: 1, externalHotelId: 1 });
