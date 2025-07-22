import { Document } from 'mongoose';
import { IPipeline } from '~/modules/tasks/@types/pipelines';

export interface IBoard {
  name?: string;
  userId?: string;
}

export interface IBoardDocument extends IBoard, Document {
  _id: string;

  type: string;
  pipelines?: IPipeline[];
  order?: number;
}
