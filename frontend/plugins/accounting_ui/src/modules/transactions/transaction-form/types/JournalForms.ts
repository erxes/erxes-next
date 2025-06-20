import { z } from 'zod';
import {
  transactionGroupSchema,
  transactionMainSchema,
  transactionCashSchema,
  transactionBankSchema,
  transactionPayableSchema,
  transactionReceivableSchema,
  transactionTaxSchema,
  transactionInvIncomeSchema,
  trDocSchema,
  invDetailSchema,
} from '../contants/transactionSchema';
import { UseFormReturn } from 'react-hook-form';

export type TAddTransactionGroup = z.infer<typeof transactionGroupSchema>;
export type TTrDoc = z.infer<typeof trDocSchema>

export type TMainJournal = z.infer<typeof transactionMainSchema>;
export type TCashJournal = z.infer<typeof transactionCashSchema>;
export type TBankJournal = z.infer<typeof transactionBankSchema>;
export type TReceivableJournal = z.infer<typeof transactionReceivableSchema>;
export type TPayableJournal = z.infer<typeof transactionPayableSchema>;
export type TTaxJournal = z.infer<typeof transactionTaxSchema>;

export type TInvIncomeJournal = z.infer<typeof transactionInvIncomeSchema>;
export type TInvDetail = z.infer<typeof invDetailSchema>;

export type ITransactionGroupForm = UseFormReturn<TAddTransactionGroup>;

export interface ICommonFieldProps {
  form: ITransactionGroupForm;
  index: number;
  detIndex?: number;
}
