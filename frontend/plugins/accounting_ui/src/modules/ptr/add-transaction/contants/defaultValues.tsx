import {
  TBankJournal,
  TCashJournal,
  TMainJournal,
} from '../types/AddTransaction';
import { CustomerType } from 'ui-modules';

export const MAIN_JOURNAL_DEFAULT_VALUES: Partial<TMainJournal> = {
  journal: 'main',
  side: 'dt',
  customerType: CustomerType.CUSTOMER,
};

export const BANK_JOURNAL_DEFAULT_VALUES: Partial<TBankJournal> = {
  journal: 'bank',
  side: 'incoming',
  customerType: CustomerType.CUSTOMER,
};

export const CASH_JOURNAL_DEFAULT_VALUES: Partial<TCashJournal> = {
  journal: 'cash',
  side: 'incoming',
  customerType: CustomerType.CUSTOMER,
};

export const JOURNALS_BY_JOURNAL = {
  main: MAIN_JOURNAL_DEFAULT_VALUES,
  bank: BANK_JOURNAL_DEFAULT_VALUES,
  cash: CASH_JOURNAL_DEFAULT_VALUES,
};
