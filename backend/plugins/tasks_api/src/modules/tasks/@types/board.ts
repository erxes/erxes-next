import { Document } from 'mongoose';
import { IPipeline } from './pipeline';

export interface IBoard {
  _id: string;
  name: string;
  userId: string;
  boardId: string;
  order: number;
  type: string;
  timestamp?: Date; // Optional in base
}

export interface IBoardDocument extends IBoard, Document {
  _id: string;
  name: string;
  userId: string;
  boardId: string;
  order: number;
  type: string;
  timestamp?: Date;
  pipelines?: IPipeline[];
}
