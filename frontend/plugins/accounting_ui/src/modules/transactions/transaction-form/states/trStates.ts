import { atom } from 'jotai';
import { ITransaction } from '../../types/Transaction';

export const activeJournalState = atom<string>('0');
export const followTrDocsState = atom<ITransaction[]>([]);
