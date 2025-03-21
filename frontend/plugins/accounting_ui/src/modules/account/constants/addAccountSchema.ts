import { CurrencyCode } from 'erxes-ui';
import { z } from 'zod';
import { AccountKind, Journal } from '../type/Account';

export const addAccountSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  categoryId: z.string().min(1),
  description: z.string().min(1),
  currency: z.nativeEnum(CurrencyCode),
  kind: z.nativeEnum(AccountKind),
  journal: z.nativeEnum(Journal),
  branchId: z.string().min(1),
  departmentId: z.string().min(1),
  isTemp: z.boolean(),
  isOutBalance: z.boolean(),
});
