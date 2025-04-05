import { CustomerType } from 'ui-modules';
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

export const transactionMainSchema = z.object({
  accountId: z.string(),
  side: z.enum(['dt', 'ct']),
  amount: z.number(),
  description: z.string(),
  customerType: z.nativeEnum(CustomerType),
  customerId: z.string(),
  branchId: z.string().optional(),
  departmentId: z.string().optional(),
  assignedUserIds: z.array(z.string()).optional(),
});

export const transactionGroupSchema = z.object({
  number: z.string(),
  date: z.date(),
  details: z.array(transactionCashSchema.or(transactionBankSchema)),
});
