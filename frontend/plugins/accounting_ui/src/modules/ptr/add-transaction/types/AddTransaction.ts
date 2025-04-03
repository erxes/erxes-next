import { z } from 'zod';
import { transactionGroupSchema } from '../contants/transactionSchema';

export type TAddTransactionGroup = z.infer<typeof transactionGroupSchema>;
