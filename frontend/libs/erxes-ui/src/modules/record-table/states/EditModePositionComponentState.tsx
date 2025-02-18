import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

export const EditModePositionComponentState = atomFamily((key: string) => atom<boolean>(false));
