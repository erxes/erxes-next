import { z } from 'zod';
import {
  transactionGroupSchema,
  transactionMainSchema,
  transactionBankSchema,
  transactionCashSchema,
} from '../contants/transactionSchema';

export type TAddTransactionGroup = z.infer<typeof transactionGroupSchema>;

export type TMainJournal = z.infer<typeof transactionMainSchema>;

export type TBankJournal = z.infer<typeof transactionBankSchema>;

export type TCashJournal = z.infer<typeof transactionCashSchema>;

export enum JournalType {
  MAIN = 'main',
  BANK = 'bank',
  CASH = 'cash',
}
