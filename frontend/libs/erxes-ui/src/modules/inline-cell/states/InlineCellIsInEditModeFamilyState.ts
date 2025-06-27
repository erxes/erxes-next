import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

export const InlineCellIsInEditModeFamilyState = atomFamily((name: string) =>
  atom<boolean>(false),
);
