import { JournalType } from '../types/AddTransaction';

export const JOURNAL_LABELS = {
  [JournalType.MAIN]: 'Main',
  [JournalType.BANK]: 'Bank',
  [JournalType.CASH]: 'Cash',
  [JournalType.INV_INCOME]: 'Inventory Income',
  [JournalType.INV_OUT]: 'Inventory Out',
};
