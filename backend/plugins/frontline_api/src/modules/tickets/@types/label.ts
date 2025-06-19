import { Document } from 'mongoose';

export interface IPipelineLabel {
  name: string;
  colorCode: string;
  pipelineId: string;
  createdBy?: string;
}

export interface IPipelineLabelDocument extends IPipelineLabel, Document {
  _id: string;

  createdAt?: Date;
}
