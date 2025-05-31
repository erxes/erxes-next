import { CustomerType } from 'ui-modules';
import { z } from 'zod';
import { TR_SIDES, TrJournalEnum } from '../../types/constants';

//#region common:
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
  transactionId: z.string().nullish(),

  accountId: z.string().nullish().refine((val) =>
    val?.length,
    { message: 'Must fill account' }
  ),
  amount: z.number().min(0),
  side: z.string().refine((val) =>
    TR_SIDES.ALL.includes(val),
    { message: 'wrong side aaaa' }
  ),

  followInfos: z.object({}).nullish(),

  excludeVat: z.boolean().nullish(),
  excludeCtax: z.boolean().nullish(),

  currencyAmount: z.number().nullish(),
  customRate: z.number().nullish(),
  assignedUserId: z.string().nullish(),

  productId: z.string().nullish(),
  count: z.number().nullish(),
  unitPrice: z.number().nullish(),

  account: z.object({
    _id: z.string(),
    code: z.string(),
    name: z.string(),
    currency: z.string(),
    kind: z.string(),
    branchId: z.string().optional(),
    departmentId: z.string().optional(),
    journal: z.string(),
  }).nullish()
});

export const currencyDetailSchema = z.object({
  currency: z.string().nullish(),
  currencyAmount: z.number().nullish(),
  customRate: z.number().nullish(),
  spotRate: z.number().nullish(),
  followInfos: z.object({
    currencyDiffAccountId: z.string(),
  }).nullish(),
})

export const baseTransactionSchema = z.object({
  _id: z.string(),
  ptrId: z.string().optional(),
  parentId: z.string().optional(),

  followInfos: z.object({}).nullish(),

  description: z.string().nullish(),
  customerType: z.nativeEnum(CustomerType),
  customerId: z.string().nullish(),
  branchId: z.string().nullish(),
  departmentId: z.string().nullish(),
  assignedUserIds: z.array(z.string()).optional(),
  details: z.array(baseTrDetailSchema).min(1),

  ...vatSchema.shape,
  ...ctaxSchema.shape,

  extraData: z.object({}).nullish(),
});
//#endregion common

//#region Single trs
export const transactionMainSchema = z.object({
  journal: z.literal(TrJournalEnum.MAIN),
  ...baseTransactionSchema.shape,
})

export const transactionCashSchema = z.object({
  journal: z.literal(TrJournalEnum.CASH),
  ...baseTransactionSchema.shape,
}).extend({
  details: z.array(z.object({
    ...baseTrDetailSchema.shape,
    ...currencyDetailSchema.shape,
  })),
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

export const transactionReceivableSchema = z.object({
  journal: z.literal(TrJournalEnum.RECEIVABLE),
  ...baseTransactionSchema.shape,
}).extend({
  customerId: z.string(),
  hasVat: z.boolean(),
  hasCtax: z.boolean(),
});

export const transactionPayableSchema = z.object({
  journal: z.literal(TrJournalEnum.PAYABLE),
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
//#endregion Single trs

//#endregion Inventories

export const invDetailSchema = z.object({
  ...baseTrDetailSchema.shape,
}).extend({
  productId: z.string(),
  quantity: z.number().min(0),
  unitPrice: z.number().min(0),
});

export const transactionInvIncomeSchema = z.object({
  journal: z.literal(TrJournalEnum.INV_INCOME),
  ...baseTransactionSchema.shape,
}).extend({
  customerId: z.string(),
  hasVat: z.boolean(),
  hasCtax: z.boolean(),
  details: z.array(z.object({
    ...invDetailSchema.shape,
  })),
});

//#region Inventories

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
    transactionCashSchema,
    transactionBankSchema,
    transactionReceivableSchema,
    transactionPayableSchema,
    transactionInvIncomeSchema,
    // transactionInvOutSchema,
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
