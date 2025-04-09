import { z } from 'zod';
import {
  transactionGroupSchema,
  transactionMainSchema,
  transactionBankSchema,
  transactionCashSchema,
  transactionInvIncomeSchema,
  transactionInvOutSchema,
} from '../contants/transactionSchema';
import { UseFormReturn } from 'react-hook-form';

export type TAddTransactionGroup = z.infer<typeof transactionGroupSchema>;

export type TMainJournal = z.infer<typeof transactionMainSchema>;

export type TBankJournal = z.infer<typeof transactionBankSchema>;

export type TCashJournal = z.infer<typeof transactionCashSchema>;

export type TInvIncomeJournal = z.infer<typeof transactionInvIncomeSchema>;

export type TInvOutJournal = z.infer<typeof transactionInvOutSchema>;

export enum JournalType {
  MAIN = 'main',
  BANK = 'bank',
  CASH = 'cash',
  INV_INCOME = 'invincome',
  INV_OUT = 'invout',
}

export type ITransactionGroupForm = UseFormReturn<TAddTransactionGroup>;

export interface ICommonFieldProps {
  form: ITransactionGroupForm;
  index: number;
}
