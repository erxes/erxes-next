import { Document } from 'mongoose';
import { IPipeline } from '~/modules/tickets/@types/pipeline';

export interface IBoard {
  name?: string;
  order?: number;
  userId?: string;
  type: string;
}

export interface IBoardDocument extends IBoard, Document {
  _id: string;

  pipelines?: IPipeline[];
  createdAt: Date;
}
