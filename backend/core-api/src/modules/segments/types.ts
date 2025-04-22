import { ISegment } from './db/definitions/segments';

export interface ISegmentsEdit extends ISegment {
  _id: string;
  conditionSegments: ISegment[];
}
