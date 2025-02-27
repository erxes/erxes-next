import { atom } from 'jotai';

export const renderingProductDetailAtom = atom(false); 
export const productDetailSheetOpenAtom = atom<boolean>(false);
export const productDetailActiveActionTabAtom = atom('');