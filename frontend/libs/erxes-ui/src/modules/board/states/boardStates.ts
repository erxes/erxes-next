import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

export const activeCardIdState = atomFamily((boardId) =>
  atom<string | null>(null),
);
