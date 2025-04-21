import { JournalEnum } from '@/account/type/Account';
import {
  TBankJournal,
  TCashJournal,
  TFixedAssetJournal,
  TInventoryJournal,
  TDebtJournal,
  TInvIncomeJournal,
  TInvOutJournal,
  TMainJournal,
  TTaxJournal,
} from '../types/AddTransaction';
import { CustomerType } from 'ui-modules';

export const MAIN_JOURNAL_DEFAULT_VALUES: Partial<TMainJournal> = {
  journal: JournalEnum.MAIN,
  side: 'dt',
  customerType: CustomerType.CUSTOMER,
};

export const DEFAULT_VAT_VALUES = {
  hasVat: false,
  handleVat: false,
  afterVat: false,
};

export const BANK_JOURNAL_DEFAULT_VALUES: Partial<TBankJournal> = {
  journal: JournalEnum.BANK,
  side: 'incoming',
  customerType: CustomerType.CUSTOMER,
  ...DEFAULT_VAT_VALUES,
};

export const CASH_JOURNAL_DEFAULT_VALUES: Partial<TCashJournal> = {
  journal: JournalEnum.CASH,
  side: 'incoming',
  customerType: CustomerType.CUSTOMER,
  ...DEFAULT_VAT_VALUES,
};

export const INV_INCOME_JOURNAL_DEFAULT_VALUES: Partial<TInvIncomeJournal> = {
  journal: JournalEnum.INV_INCOME,
  customerType: CustomerType.CUSTOMER,
  ...DEFAULT_VAT_VALUES,
  products: [
    {
      productId: '',
      accountId: '',
      quantity: 0,
      unitPrice: 0,
      amount: 0,
    },
  ],
};

export const INV_OUT_JOURNAL_DEFAULT_VALUES: Partial<TInvOutJournal> = {
  journal: JournalEnum.INV_OUT,
  customerType: CustomerType.CUSTOMER,
  ...DEFAULT_VAT_VALUES,
};

export const DEBT_JOURNAL_DEFAULT_VALUES: Partial<TDebtJournal> = {
  journal: JournalEnum.DEBT,
  customerType: CustomerType.CUSTOMER,
  ...DEFAULT_VAT_VALUES,
};

export const INVENTORY_JOURNAL_DEFAULT_VALUES: Partial<TInventoryJournal> = {
  journal: JournalEnum.INVENTORY,
  customerType: CustomerType.CUSTOMER,
  ...DEFAULT_VAT_VALUES,
};

export const TAX_JOURNAL_DEFAULT_VALUES: Partial<TTaxJournal> = {
  journal: JournalEnum.TAX,
  customerType: CustomerType.CUSTOMER,
  ...DEFAULT_VAT_VALUES,
};

export const FIXED_ASSET_JOURNAL_DEFAULT_VALUES: Partial<TFixedAssetJournal> = {
  journal: JournalEnum.FIXED_ASSET,
  customerType: CustomerType.CUSTOMER,
  ...DEFAULT_VAT_VALUES,
};

export const JOURNALS_BY_JOURNAL = {
  [JournalEnum.MAIN]: MAIN_JOURNAL_DEFAULT_VALUES,
  [JournalEnum.BANK]: BANK_JOURNAL_DEFAULT_VALUES,
  [JournalEnum.CASH]: CASH_JOURNAL_DEFAULT_VALUES,
  [JournalEnum.DEBT]: DEBT_JOURNAL_DEFAULT_VALUES,
  [JournalEnum.INVENTORY]: INVENTORY_JOURNAL_DEFAULT_VALUES,
  [JournalEnum.FIXED_ASSET]: FIXED_ASSET_JOURNAL_DEFAULT_VALUES,
  [JournalEnum.TAX]: TAX_JOURNAL_DEFAULT_VALUES,
  [JournalEnum.INV_INCOME]: INV_INCOME_JOURNAL_DEFAULT_VALUES,
  [JournalEnum.INV_OUT]: INV_OUT_JOURNAL_DEFAULT_VALUES,
};
