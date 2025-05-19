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
