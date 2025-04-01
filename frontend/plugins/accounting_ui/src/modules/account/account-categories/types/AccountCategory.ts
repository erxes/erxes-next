import { accountCategorySchema } from '../constants/accountCategorySchema';
import { z } from 'zod';

export interface IAccountCategory {
  _id: string;
  name: string;
  code: string;
  description: string;
  parentId: string;
}

export type TAccountCategoryForm = z.infer<typeof accountCategorySchema>;
