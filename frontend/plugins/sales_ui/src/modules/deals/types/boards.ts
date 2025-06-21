import { IPipeline } from "./pipelines";

export interface IBoard {
    _id: string;
    name: string;
    pipelines?: IPipeline[];
  }
  
export interface IBoardCount {
    _id: string;
    name: string;
    count: number;
}     