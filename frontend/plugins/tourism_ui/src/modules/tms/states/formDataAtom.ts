import { atom } from 'jotai';
import { TmsFormType } from '@/tms/constants/formSchema';

export const formDataAtom = atom<Partial<TmsFormType> | undefined>(undefined);
