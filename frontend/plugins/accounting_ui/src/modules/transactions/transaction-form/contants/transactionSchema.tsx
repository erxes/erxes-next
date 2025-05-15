import { CustomerType } from 'ui-modules';
import { z } from 'zod';
import { TR_SIDES, TrJournalEnum } from '../../types/constants';

export const vatSchema = z.object({
  hasVat: z.boolean().optional().nullish(),
  handleVat: z.boolean().optional().nullish(),
  afterVat: z.boolean().optional().nullish(),
  vatRowId: z.string().optional().nullish(),
  vatAmount: z.number().optional().nullish(),
  vatRow: z.object({
    _id: z.string(),
    name: z.string(),
    percent: z.number()
  }).nullish(),
});

export const ctaxSchema = z.object({
  hasCtax: z.boolean().optional(),
  handleCtax: z.boolean().optional().nullish(),
  ctaxRowId: z.string().optional().nullish(),
  ctaxAmount: z.number().optional().nullish(),
});

export const baseTrDetailSchema = z.object({
  // nullish() busad
  accountId: z.string().nullish().refine((val) =>
    val?.length,
    { message: 'Must fill account' }
  ),
  amount: z.number().min(0),
  side: z.string().refine((val) =>
    TR_SIDES.ALL.includes(val),
    { message: 'wrong side aaaa' }
  ),
});

export const baseTransactionSchema = z.object({
  _id: z.string(),
  description: z.string().nullish(),
  customerType: z.nativeEnum(CustomerType),
  customerId: z.string().nullish(),
  branchId: z.string().nullish(),
  departmentId: z.string().nullish(),
  assignedUserIds: z.array(z.string()).optional(),
  details: z.array(baseTrDetailSchema).min(1),
  followInfos: z.object({}).nullish(),
  follows: z.object({}).nullish(),
  ...vatSchema.shape,
  ...ctaxSchema.shape,

});

export const inventorySchema = z.object({
  productId: z.string().optional(),
  quantity: z.number().min(1),
  unitPrice: z.number().min(1),
  ...baseTrDetailSchema.shape
});

export const transactionMainSchema = z.object({
  journal: z.literal(TrJournalEnum.MAIN),
  ...baseTransactionSchema.shape,
})

export const transactionCashSchema = z.object({
  journal: z.literal(TrJournalEnum.CASH),
  ...baseTransactionSchema.shape,
}).extend({
  customerId: z.string(),
  hasVat: z.boolean(),
  hasCtax: z.boolean(),
});

export const transactionBankSchema = z.object({
  journal: z.literal(TrJournalEnum.BANK),
  ...baseTransactionSchema.shape,
}).extend({
  customerId: z.string(),
  hasVat: z.boolean(),
  hasCtax: z.boolean(),
});

export const transactionDebtSchema = z.object({
  journal: z.literal(TrJournalEnum.DEBT),
  ...baseTransactionSchema.shape,
}).extend({
  customerId: z.string(),
  hasVat: z.boolean(),
  hasCtax: z.boolean(),
});

export const transactionTaxSchema = z.object({
  journal: z.literal('tax'),
  ...baseTransactionSchema.shape,
});


// export const transactionInvIncomeSchema = z.object({
//   journal: z.literal('invIncome'),
//   ...baseTransactionSchema.shape,
//   details: z.array(inventorySchema).min(1),
//   ...vatSchema.shape,
// });

// export const transactionInvOutSchema = z.object({
//   journal: z.literal('invOut'),
//   ...baseTransactionSchema.shape,
//   details: z.array(inventorySchema).min(1),
//   ...vatSchema.shape,
// });

// export const transactionInventorySchema = z.object({
//   journal: z.literal('inv'),
//   ...baseTransactionSchema.shape,
//   ...vatSchema.shape,
// });

// export const transactionFixedAssetSchema = z.object({
//   journal: z.literal('asset'),
//   ...baseTransactionSchema.shape,
//   ...vatSchema.shape,
// });


export const trDocSchema = z
  .discriminatedUnion('journal', [
    transactionMainSchema,
    transactionBankSchema,
    transactionCashSchema,
    // transactionInvIncomeSchema,
    // transactionInvOutSchema,
    transactionDebtSchema,
    // transactionInventorySchema,
    // transactionFixedAssetSchema,
    transactionTaxSchema,
  ])
  // vat
  .refine(
    (data) => {
      if ('hasVat' in data) {
        if (data.hasVat && !data.vatRowId) {
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
  )
//ctax

// cash

export const transactionGroupSchema = z.object({
  parentId: z.string().optional(),
  number: z.string().optional(),
  date: z.date(),
  trDocs: z
    .array(
      trDocSchema
    )
    .min(1),
});
