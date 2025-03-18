import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

export const EditModePositionComponentState = atomFamily((id: string) => atom(false));
