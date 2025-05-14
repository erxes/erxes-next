
export enum TrJournalEnum {
  MAIN = 'main',
  CASH = 'cash',
  BANK = 'bank',
  DEBT = 'debt',
  INVENTORY = 'inventory',
  FIXED_ASSET = 'fixedAsset',
  TAX = 'tax',
  INV_INCOME = 'invIncome',
  INV_OUT = 'invOut',
}

export const TR_JOURNAL_LABELS = {
  [TrJournalEnum.MAIN]: 'Main',
  [TrJournalEnum.BANK]: 'Bank',
  [TrJournalEnum.CASH]: 'Cash',
  [TrJournalEnum.DEBT]: 'Debt',
  [TrJournalEnum.INVENTORY]: 'Inventory',
  [TrJournalEnum.FIXED_ASSET]: 'Fixed Asset',
  [TrJournalEnum.TAX]: 'Tax',
  [TrJournalEnum.INV_INCOME]: 'Inventory Income',
  [TrJournalEnum.INV_OUT]: 'Inventory Out',
};
