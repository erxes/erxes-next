import { z } from 'zod';
import { CustomerType } from 'ui-modules';
import { JournalEnum } from '@/settings/account/types/Account';

export const baseTransactionSchema = z.object({
  accountId: z.string(),
  description: z.string().optional(),
  customerType: z.nativeEnum(CustomerType),
  customerId: z.string(),
  branchId: z.string().optional(),
  departmentId: z.string().optional(),
  assignedUserIds: z.array(z.string()).optional(),
});

export const productSchema = z.object({
  productId: z.string().min(1),
  accountId: z.string().min(1),
  quantity: z.number().min(1),
  unitPrice: z.number().min(1),
  amount: z.number().min(1),
});

export const vatSchema = z.object({
  hasVat: z.boolean().optional(),
  handleVat: z.boolean().optional(),
  afterVat: z.boolean().optional(),
  vatRow: z.string().optional(),
  vatAmount: z.number().optional(),
});

export const transactionCashSchema = z.object({
  journal: z.literal('cash'),
  side: z.enum(['incoming', 'outgoing']),
  amount: z.number(),
  ...baseTransactionSchema.shape,
  ...vatSchema.shape,
});

export const transactionBankSchema = z.object({
  journal: z.literal('bank'),
  side: z.enum(['incoming', 'outgoing']),
  amount: z.number(),
  ...baseTransactionSchema.shape,
  ...vatSchema.shape,
});

export const transactionMainSchema = z.object({
  journal: z.literal('main'),
  side: z.enum(['dt', 'ct']),
  amount: z.number(),
  ...baseTransactionSchema.shape,
});

export const transactionInvIncomeSchema = z.object({
  journal: z.literal(JournalEnum.INV_INCOME),
  ...baseTransactionSchema.shape,
  products: z.array(productSchema).min(1),
  ...vatSchema.shape,
});

export const transactionInvOutSchema = z.object({
  journal: z.literal(JournalEnum.INV_OUT),
  ...baseTransactionSchema.shape,
  products: z.array(productSchema).min(1),
  ...vatSchema.shape,
});

export const transactionDebtSchema = z.object({
  journal: z.literal(JournalEnum.DEBT),
  ...baseTransactionSchema.shape,
  ...vatSchema.shape,
});

export const transactionInventorySchema = z.object({
  journal: z.literal(JournalEnum.INVENTORY),
  ...baseTransactionSchema.shape,
  ...vatSchema.shape,
});

export const transactionFixedAssetSchema = z.object({
  journal: z.literal(JournalEnum.FIXED_ASSET),
  ...baseTransactionSchema.shape,
  ...vatSchema.shape,
});

export const transactionTaxSchema = z.object({
  journal: z.literal(JournalEnum.TAX),
  ...baseTransactionSchema.shape,
});

export const transactionGroupSchema = z.object({
  number: z.string().optional(),
  date: z.date(),
  details: z
    .array(
      z
        .discriminatedUnion('journal', [
          transactionMainSchema,
          transactionBankSchema,
          transactionCashSchema,
          transactionInvIncomeSchema,
          transactionInvOutSchema,
          transactionDebtSchema,
          transactionInventorySchema,
          transactionFixedAssetSchema,
          transactionTaxSchema,
        ])
        .refine(
          (data) => {
            if ('hasVat' in data) {
              if (data.hasVat && !data.vatRow) {
                return false;
              }
            }
            return true;
          },
          {
            path: ['vatRow'],
            message: 'VAT row is required',
          },
        )
        .refine(
          (data) => {
            if ('handleVat' in data) {
              if (data.handleVat && !data.vatAmount) {
                return false;
              }
            }
            return true;
          },
          {
            path: ['vatAmount'],
            message: 'VAT amount is required',
          },
        ),
    )
    .min(1),
});
