import { z } from 'zod';
import { CustomerType } from 'ui-modules';
export const baseTransactionSchema = z.object({
  accountId: z.string().optional(),
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
  amount: z.number(),
  ...baseTransactionSchema.shape,
});

export const transactionBankSchema = z.object({
  journal: z.literal('bank'),
  side: z.enum(['incoming', 'outgoing']),
  amount: z.number(),
  ...baseTransactionSchema.shape,
});

export const transactionMainSchema = z.object({
  journal: z.literal('main'),
  side: z.enum(['dt', 'ct']),
  amount: z.number(),
  ...baseTransactionSchema.shape,
});

export const productSchema = z.object({
  productId: z.string(),
  accountId: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  amount: z.number(),
});

export const transactionInvIncomeSchema = z.object({
  journal: z.literal('invincome'),
  ...baseTransactionSchema.shape,
  products: z.array(productSchema),
});

export const transactionInvOutSchema = z.object({
  journal: z.literal('invout'),
  ...baseTransactionSchema.shape,
  products: z.array(productSchema),
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
        transactionInvIncomeSchema,
        transactionInvOutSchema,
      ]),
    )
    .min(1),
});
