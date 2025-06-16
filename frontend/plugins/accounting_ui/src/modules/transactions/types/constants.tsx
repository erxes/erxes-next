export enum TrJournalEnum {
  MAIN = 'main',
  CASH = 'cash',
  BANK = 'bank',
  RECEIVABLE = 'receivable',
  PAYABLE = 'payable',
  INVENTORY = 'inventory',
  FIXED_ASSET = 'fixedAsset',
  TAX = 'tax',
  INV_INCOME = 'invIncome',
  INV_OUT = 'invOut',
}

export const TR_JOURNAL_LABELS = {
  [TrJournalEnum.MAIN]: 'Main',
  [TrJournalEnum.CASH]: 'Cash',
  [TrJournalEnum.BANK]: 'Bank',
  [TrJournalEnum.RECEIVABLE]: 'receivable',
  [TrJournalEnum.PAYABLE]: 'payable',
  [TrJournalEnum.INVENTORY]: 'Inventory',
  [TrJournalEnum.FIXED_ASSET]: 'Fixed Asset',
  [TrJournalEnum.TAX]: 'Tax',
  [TrJournalEnum.INV_INCOME]: 'Inventory Income',
  [TrJournalEnum.INV_OUT]: 'Inventory Out',
};

export const TR_SIDES = {
  DEBIT: 'dt' as const,
  CREDIT: 'ct' as const,
  ALL: ['dt', 'ct'],
  ENUM: { DT: 'dt', CT: 'ct' } as const,
  OPTIONS: [{ value: 'dt', label: 'debit' }, { value: 'ct', label: 'credit' }],
  FUND_OPTIONS: [{ value: 'dt', label: 'incoming' }, { value: 'ct', label: 'outgoing' }],
  RECEIVABLE_OPTIONS: [{ value: 'dt', label: 'open' }, { value: 'ct', label: 'close' }],
  PAYABLE_OPTIONS: [{ value: 'dt', label: 'close' }, { value: 'ct', label: 'open' }],
}

export const INV_INCOME_EXPENSE_TYPES = [
  { value: 'amount', label: 'Amount' },
  { value: 'count', label: 'Count' }
]
