import { atom } from 'jotai';

// Active tab state atom
export const activeTabAtom = atom<string>('');

// Derived atoms for specific tab states
export const isChatTabAtom = atom((get) => get(activeTabAtom) === 'chat');
export const isTicketTabAtom = atom((get) => get(activeTabAtom) === 'ticket');
export const isFaqTabAtom = atom((get) => get(activeTabAtom) === 'faq');
export const isCallTabAtom = atom((get) => get(activeTabAtom) === 'call');
export const isBugTabAtom = atom((get) => get(activeTabAtom) === 'bug');
export const isHomeTabAtom = atom((get) => get(activeTabAtom) === '');

// Action atoms for tab management
export const setActiveTabAtom = atom(
  null,
  (get, set, newTab: string) => {
    set(activeTabAtom, newTab);
  }
);

export const resetTabAtom = atom(
  null,
  (get, set) => {
    set(activeTabAtom, '');
  }
);
