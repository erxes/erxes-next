import { z } from 'zod';
import { CustomerType } from 'ui-modules';
export const baseTransactionSchema = z.object({
  accountId: z.string().optional(),
  amount: z.number(),
  description: z.string(),
  customerType: z.nativeEnum(CustomerType),
  customerId: z.string(),
  branchId: z.string().optional(),
  departmentId: z.string().optional(),
  assignedUserIds: z.array(z.string()).optional(),
});

export const transactionCashSchema = z.object({
  journal: z.literal('cash'),
  side: z.enum(['incoming', 'outgoing']),
  ...baseTransactionSchema.shape,
});

export const transactionBankSchema = z.object({
  journal: z.literal('bank'),
  side: z.enum(['incoming', 'outgoing']),
  ...baseTransactionSchema.shape,
});

export const transactionMainSchema = z.object({
  journal: z.literal('main'),
  side: z.enum(['dt', 'ct']),
  ...baseTransactionSchema.shape,
});

export const transactionGroupSchema = z.object({
  number: z.string(),
  date: z.date(),
  details: z
    .array(
      z.discriminatedUnion('journal', [
        transactionMainSchema,
        transactionBankSchema,
        transactionCashSchema,
      ]),
    )
    .min(1),
});
