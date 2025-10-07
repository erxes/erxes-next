import { atom } from 'jotai';
import { TabType } from './types';
import { IBrand, IBrowserInfo, IConnection, IMessage, IUiOptions } from '@/types';

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
export const setActiveTabAtom = atom(null, (_, set, newTab: TabType) => {
  set(activeTabAtom, newTab);
});

export const resetTabAtom = atom(null, (_, set) => {
  set(activeTabAtom, '');
});

// Messenger state atoms
export const isMessengerOpenAtom = atom<boolean>(false);
export const currentConversationAtom = atom<string | null>(null);
export const messagesAtom = atom<any[]>([]);

export const browserInfoAtom = atom<IBrowserInfo | null>(null);
export const isBrowserInfoSavedAtom = atom<boolean>(false);
export const lastUnreadMessageAtom = atom<IMessage | null>(null);
export const connectionAtom = atom<IConnection>({
  setting: {},
  data: {},
  leadData: {},
  queryVariables:
    '$integrationId: String!, $customerId: String, $visitorId: String',
  queryParams:
    'integrationId: $integrationId, customerId: $customerId, visitorId: $visitorId',
  enabledServices: {},
  browserInfo: undefined,
});

export const integrationIdAtom = atom<string | null>(null);

export const conversationIdAtom = atom<string | null>(null);

export const uiOptionsAtom = atom<IUiOptions | null>(null);

export const brandAtom = atom<IBrand | null>(null);
