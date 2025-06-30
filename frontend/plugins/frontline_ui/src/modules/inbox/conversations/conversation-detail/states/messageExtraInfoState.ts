import { atom } from 'jotai';

export const messageExtraInfoState = atom<{ tag?: string } | undefined>(
  undefined,
);
