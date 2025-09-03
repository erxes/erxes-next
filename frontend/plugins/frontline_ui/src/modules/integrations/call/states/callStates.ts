import { atom } from 'jotai';

export const historyIdAtom = atom<string | null>(null);

export const currentCallConversationIdAtom = atom<string | null>(null);

export const inCallViewAtom = atom<string | null>(null);

export const callDurationAtom = atom<Date | null>(null);
