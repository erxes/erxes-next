import { ISegment } from './db/definitions/segments';

export interface ISegmentsEdit extends ISegment {
  _id: string;
  conditionSegments: ISegment[];
}
export type IOptions = {
  returnAssociated?: { mainType: string; relType: string };
  returnFields?: string[];
  returnFullDoc?: boolean;
  returnSelector?: boolean;
  returnCount?: boolean;
  defaultMustSelector?: any[];
  page?: number;
  perPage?: number;
  sortField?: string;
  sortDirection?: number;
  scroll?: boolean;
};
