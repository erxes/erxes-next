import { atom } from 'jotai';

export const historyIdAtom = atom<string | null>(null);

export const currentCallConversationIdAtom = atom<string | null>(null);
