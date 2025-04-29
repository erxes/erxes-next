import { z } from 'zod';
import { ctaxFormSchema } from '../constants/ctaxFormSchema';

export interface ICtaxRow {
  _id: string;
  name: string;
  number: string;
  kind: CtaxKind;
  percent: number;
  status: CtaxStatus;
}

export enum CtaxKind {
  NORMAL = 'normal',
  FORMULA = 'formula',
  TITLE = 'title',
  HIDDEN = 'hidden',
}

export enum CtaxStatus {
  ACTIVE = 'active',
  DELETED = 'deleted',
}

export type CtaxFormValues = z.infer<typeof ctaxFormSchema>;
