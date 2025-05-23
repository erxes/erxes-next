import { CustomerType } from 'ui-modules';
import { z } from 'zod';
import { TR_SIDES, TrJournalEnum } from '../../types/constants';

export const vatSchema = z.object({
  hasVat: z.boolean().optional().nullish(),
  handleVat: z.boolean().optional().nullish(),
  afterVat: z.boolean().optional().nullish(),
  vatRowId: z.string().optional().nullish(),
  vatAmount: z.number().optional().nullish(),
});

export const ctaxSchema = z.object({
  hasCtax: z.boolean().optional(),
  handleCtax: z.boolean().optional().nullish(),
  ctaxRowId: z.string().optional().nullish(),
  ctaxAmount: z.number().optional().nullish(),
});

export const baseTrDetailSchema = z.object({
  _id: z.string(),
  transactionId: z.string(),

  accountId: z.string().nullish().refine((val) =>
    val?.length,
    { message: 'Must fill account' }
  ),
  amount: z.number().min(0),
  side: z.string().refine((val) =>
    TR_SIDES.ALL.includes(val),
    { message: 'wrong side aaaa' }
  ),

  originId: z.string().nullish(),
  followType: z.string().nullish(),
  followInfos: z.object({}).nullish(),
  follows: z.array(z.object({ id: z.string(), type: z.string() })).nullish(),

  excludeVat: z.boolean().nullish(),
  excludeCtax: z.boolean().nullish(),

  currencyAmount: z.number().nullish(),
  customRate: z.number().nullish(),
  assignedUserId: z.string().nullish(),

  productId: z.string().nullish(),
  count: z.number().nullish(),
  unitPrice: z.number().nullish(),
});

export const baseTransactionSchema = z.object({
  _id: z.string(),
  ptrId: z.string(),
  parentId: z.string(),

  originId: z.string().nullish(),
  followType: z.string().nullish(),
  followInfos: z.object({}).nullish(),
  follows: z.array(z.object({ id: z.string(), type: z.string() })).nullish(),

  description: z.string().nullish(),
  customerType: z.nativeEnum(CustomerType),
  customerId: z.string().nullish(),
  branchId: z.string().nullish(),
  departmentId: z.string().nullish(),
  assignedUserIds: z.array(z.string()).optional(),
  details: z.array(baseTrDetailSchema).min(1),

  ...vatSchema.shape,
  ...ctaxSchema.shape,

  sumDt: z.number(),
  sumCt: z.number(),
  extraData: z.object({}).nullish(),

});

// export const inventorySchema = z.object({
//   productId: z.string().optional(),
//   quantity: z.number().min(1),
//   unitPrice: z.number().min(1),
//   ...baseTrDetailSchema.shape
// });

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
