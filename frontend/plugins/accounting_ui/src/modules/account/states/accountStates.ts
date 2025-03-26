import { atom } from 'jotai';
import { IAccount } from '../type/Account';

export const accountDetailAtom = atom<IAccount | null>(null);
