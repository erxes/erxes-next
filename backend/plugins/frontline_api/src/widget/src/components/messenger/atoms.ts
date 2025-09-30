import { atom } from 'jotai';
import { TabType } from './types';

// Active tab state atom
export const activeTabAtom = atom<TabType>('');

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
  (_, set, newTab: TabType) => {
    set(activeTabAtom, newTab);
  }
);

export const resetTabAtom = atom(
  null,
  (_, set) => {
    set(activeTabAtom, '');
  }
);

// Messenger state atoms
export const isMessengerOpenAtom = atom<boolean>(false);
export const currentConversationAtom = atom<string | null>(null);
export const messagesAtom = atom<any[]>([]);
