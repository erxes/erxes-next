import { CustomerType } from 'ui-modules';
import { TR_SIDES, TrJournalEnum } from '../../types/constants';
import { ITransaction, ITrDetail } from '../../types/Transaction';
import { getTempId } from '../components/utils';
import {
  TBankJournal,
  TCashJournal,
  TDebtJournal,
  // TFixedAssetJournal,
  // TInventoryJournal,
  // TInvIncomeJournal,
  // TInvOutJournal,
  TMainJournal,
  TTaxJournal,
} from '../types/AddTransaction';

export const DEFAULT_VAT_VALUES = (doc?: ITransaction) => {
  return {
    hasVat: doc?.hasVat ?? false,
    isHandleVat: doc?.isHandleVat ?? false,
    afterVat: doc?.afterVat ?? false,
    vatRowId: doc?.vatRowId,
  }
};

export const DEFAULT_CTAX_VALUES = (doc?: ITransaction) => {
  return {
    hasCtax: doc?.hasCtax ?? false,
    isHandleCtax: doc?.isHandleCtax ?? false,
    ctaxRowId: doc?.ctaxRowId,
  }
};

export const MAIN_JOURNAL_DEFAULT_VALUES = (doc?: ITransaction): Partial<TMainJournal> => {
  return {
    ...doc,
    journal: TrJournalEnum.MAIN,
    _id: doc?._id ?? getTempId(),
    customerType: doc?.customerType || CustomerType.CUSTOMER,
    details: [{
      ...(doc?.details[0] || {}),
      side: (doc?.details[0]?.side || TR_SIDES.DEBIT),
      amount: doc?.details[0]?.amount ?? 0,
    }]
  };
}

export const CASH_JOURNAL_DEFAULT_VALUES = (doc?: ITransaction): Partial<TCashJournal> => {
  return {
    ...doc,
    journal: TrJournalEnum.CASH,
    _id: doc?._id ?? getTempId(),
    customerType: doc?.customerType || CustomerType.CUSTOMER,
    ...DEFAULT_VAT_VALUES(doc),
    ...DEFAULT_CTAX_VALUES(doc),
    details: [{
      ...(doc?.details[0] || {}),
      side: (doc?.details[0]?.side || TR_SIDES.DEBIT),
      amount: doc?.details[0]?.amount ?? 0,
    }]
  };
};

export const BANK_JOURNAL_DEFAULT_VALUES = (doc?: ITransaction): Partial<TBankJournal> => {
  return {
    ...doc,
    journal: TrJournalEnum.BANK,
    _id: doc?._id ?? getTempId(),
    customerType: doc?.customerType || CustomerType.CUSTOMER,
    ...DEFAULT_VAT_VALUES(doc),
    ...DEFAULT_CTAX_VALUES(doc),
    details: [{
      ...(doc?.details[0] || {}),
      side: (doc?.details[0]?.side || TR_SIDES.DEBIT),
      amount: doc?.details[0]?.amount ?? 0,
    }]
  }
};

export const DEBT_JOURNAL_DEFAULT_VALUES = (doc?: ITransaction): Partial<TDebtJournal> => {
  return {
    ...doc,
    journal: TrJournalEnum.DEBT,
    customerType: doc?.customerType || CustomerType.CUSTOMER,
    ...DEFAULT_VAT_VALUES(doc),
    ...DEFAULT_CTAX_VALUES(doc),
    details: [{
      ...(doc?.details[0] || {}),
      side: (doc?.details[0]?.side || TR_SIDES.DEBIT),
      amount: doc?.details[0]?.amount ?? 0,
    }]
  };
}

export const TAX_JOURNAL_DEFAULT_VALUES = (doc?: ITransaction): Partial<TTaxJournal> => {
  return {
    journal: TrJournalEnum.TAX,
    customerType: doc?.customerType || CustomerType.CUSTOMER,
    details: [{
      ...(doc?.details[0] || {}),
      side: (doc?.details[0]?.side || TR_SIDES.DEBIT),
      amount: doc?.details[0]?.amount ?? 0,
    }]
  }
};

// export const INV_INCOME_JOURNAL_DEFAULT_VALUES: Partial<TInvIncomeJournal> = {
//   journal: TrJournalEnum.INV_INCOME,
//   customerType: CustomerType.CUSTOMER,
//   ...DEFAULT_VAT_VALUES,
//   details: [
//     {
//       side: 'dt',
//       accountId: '',
//       productId: '',
//       quantity: 0,
//       unitPrice: 0,
//       amount: 0,
//     },
//   ],
// };

// export const INV_OUT_JOURNAL_DEFAULT_VALUES: Partial<TInvOutJournal> = {
//   journal: TrJournalEnum.INV_OUT,
//   customerType: CustomerType.CUSTOMER,
//   ...DEFAULT_VAT_VALUES,
// };

// export const INVENTORY_JOURNAL_DEFAULT_VALUES: Partial<TInventoryJournal> = {
//   // journal: TrJournalEnum.INVENTORY,
//   customerType: CustomerType.CUSTOMER,
//   ...DEFAULT_VAT_VALUES,
// };

// export const FIXED_ASSET_JOURNAL_DEFAULT_VALUES: Partial<TFixedAssetJournal> = {
//   // journal: TrJournalEnum.FIXED_ASSET,
//   customerType: CustomerType.CUSTOMER,
//   ...DEFAULT_VAT_VALUES,
// };

export const JOURNALS_BY_JOURNAL = (journal: string, doc?: ITransaction) => {
  if (!doc) {
    doc = {
      details: [] as ITrDetail[]
    } as ITransaction
  }

  if (!doc?._id) {
    doc._id = getTempId();
  }

  switch (journal) {
    // case TrJournalEnum.MAIN:
    //   return MAIN_JOURNAL_DEFAULT_VALUES(doc);
    case TrJournalEnum.CASH:
      return CASH_JOURNAL_DEFAULT_VALUES(doc);

    case TrJournalEnum.BANK:
      return BANK_JOURNAL_DEFAULT_VALUES(doc);

    case TrJournalEnum.DEBT:
      return DEBT_JOURNAL_DEFAULT_VALUES(doc);

    default:
      return MAIN_JOURNAL_DEFAULT_VALUES(doc);
  }
  //   [TrJournalEnum.INVENTORY]: INVENTORY_JOURNAL_DEFAULT_VALUES,
  //   [TrJournalEnum.FIXED_ASSET]: FIXED_ASSET_JOURNAL_DEFAULT_VALUES,
  //   [TrJournalEnum.TAX]: TAX_JOURNAL_DEFAULT_VALUES,
  //   [TrJournalEnum.INV_INCOME]: INV_INCOME_JOURNAL_DEFAULT_VALUES,
  //   [TrJournalEnum.INV_OUT]: INV_OUT_JOURNAL_DEFAULT_VALUES,
};
