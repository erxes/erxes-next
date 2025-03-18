import { z } from 'zod';

export const transactionCashSchema = z.object({
  accountId: z.string().optional(),
  side: z.enum(['incoming', 'outgoing']),
  amount: z.number(),
  description: z.string(),
  customerType: z.enum(['customer', 'company', 'user']),
  customerId: z.string(),
  branchId: z.string().optional(),
  departmentId: z.string().optional(),
  assignedTo: z.string().optional(),
});

export const transactionBankSchema = z.object({
  accountId: z.string().optional(),
  side: z.enum(['incoming', 'outgoing']),
  amount: z.number(),
  description: z.string(),
  customerType: z.enum(['customer', 'company', 'user']),
  customerId: z.string(),
  branchId: z.string().optional(),
  departmentId: z.string().optional(),
  assignedTo: z.string().optional(),
});

export const transactionSchema = z.object({
  number: z.string(),
  date: z.date(),
  cash: transactionCashSchema,
  // bank: transactionBankSchema,
});
