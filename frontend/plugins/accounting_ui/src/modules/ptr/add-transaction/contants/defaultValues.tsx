import {
  JournalType,
  TBankJournal,
  TCashJournal,
  TInvIncomeJournal,
  TInvOutJournal,
  TMainJournal,
} from '../types/AddTransaction';
import { CustomerType } from 'ui-modules';

export const MAIN_JOURNAL_DEFAULT_VALUES: Partial<TMainJournal> = {
  journal: JournalType.MAIN,
  side: 'dt',
  customerType: CustomerType.CUSTOMER,
};

export const BANK_JOURNAL_DEFAULT_VALUES: Partial<TBankJournal> = {
  journal: JournalType.BANK,
  side: 'incoming',
  customerType: CustomerType.CUSTOMER,
};

export const CASH_JOURNAL_DEFAULT_VALUES: Partial<TCashJournal> = {
  journal: JournalType.CASH,
  side: 'incoming',
  customerType: CustomerType.CUSTOMER,
};

export const INV_INCOME_JOURNAL_DEFAULT_VALUES: Partial<TInvIncomeJournal> = {
  journal: JournalType.INV_INCOME,
  customerType: CustomerType.CUSTOMER,
};

export const INV_OUT_JOURNAL_DEFAULT_VALUES: Partial<TInvOutJournal> = {
  journal: JournalType.INV_OUT,
  customerType: CustomerType.CUSTOMER,
};

export const JOURNALS_BY_JOURNAL = {
  [JournalType.MAIN]: MAIN_JOURNAL_DEFAULT_VALUES,
  [JournalType.BANK]: BANK_JOURNAL_DEFAULT_VALUES,
  [JournalType.CASH]: CASH_JOURNAL_DEFAULT_VALUES,
  [JournalType.INV_INCOME]: INV_INCOME_JOURNAL_DEFAULT_VALUES,
  [JournalType.INV_OUT]: INV_OUT_JOURNAL_DEFAULT_VALUES,
};
