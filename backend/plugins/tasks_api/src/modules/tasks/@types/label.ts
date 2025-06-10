import { Document } from 'mongoose';



export interface IPipelineLabel {
    name: string;
    colorCode: string;
    pipelineId: string;
    createdBy?: string;
    createdAt?: Date;
  }
  

  
export interface IPipelineLabelDocument extends IPipelineLabel, Document {
      _id: string;
    }


export interface ILabelObjectParams {
    labelIds: string[];
    targetId: string;
    collection: any;
}