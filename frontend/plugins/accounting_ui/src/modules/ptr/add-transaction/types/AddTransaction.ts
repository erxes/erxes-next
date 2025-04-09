import { z } from 'zod';
import {
  transactionGroupSchema,
  transactionMainSchema,
  transactionBankSchema,
  transactionCashSchema,
  transactionInvIncomeSchema,
  transactionInvOutSchema,
  transactionInventorySchema,
  transactionDebtSchema,
  transactionFixedAssetSchema,
  transactionTaxSchema,
  productSchema,
} from '../contants/transactionSchema';
import { UseFormReturn } from 'react-hook-form';

export type TAddTransactionGroup = z.infer<typeof transactionGroupSchema>;

export type TMainJournal = z.infer<typeof transactionMainSchema>;

export type TBankJournal = z.infer<typeof transactionBankSchema>;

export type TCashJournal = z.infer<typeof transactionCashSchema>;

export type TInvIncomeJournal = z.infer<typeof transactionInvIncomeSchema>;

export type TInvOutJournal = z.infer<typeof transactionInvOutSchema>;

export type TDebtJournal = z.infer<typeof transactionDebtSchema>;

export type TInventoryJournal = z.infer<typeof transactionInventorySchema>;

export type TFixedAssetJournal = z.infer<typeof transactionFixedAssetSchema>;

export type TTaxJournal = z.infer<typeof transactionTaxSchema>;

export type ITransactionGroupForm = UseFormReturn<TAddTransactionGroup>;

export type TInventoryProduct = z.infer<typeof productSchema>;

export interface ICommonFieldProps {
  form: ITransactionGroupForm;
  index: number;
}
