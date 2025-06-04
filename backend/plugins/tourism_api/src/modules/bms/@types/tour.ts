import { Document } from 'mongoose';
import { ILocation } from '@/bms/@types/itinerary';

export interface IGuideItem {
  guideId: string;
  type: string;
}
export interface ITour {
  name: string;
  groupCode: string;
  refNumber?: string;
  content: string;
  duration: string;
  location: ILocation[];
  startDate: Date;
  endDate: Date;
  groupSize: number;
  guides: IGuideItem[];
  status: string;
  cost: number;
  branchId: string;
  tags: string[];
  viewCount: number;
  advancePercent?: number;
  joinPercent?: number;
  advanceCheck?: boolean;
  info1?: string;
  info2?: string;
  info3?: string;
  info4?: string;
  info5?: string;
  extra?: any;
  images?: string[];
  imageThumbnail?: string;
}

export interface ITourDocument extends ITour, Document {
  _id: string;
  createdAt: Date;
  modifiedAt: Date;
  searchText: string;
}
