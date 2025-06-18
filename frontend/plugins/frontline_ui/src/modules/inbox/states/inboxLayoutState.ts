import { isUndefinedOrNull } from 'erxes-ui';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const inboxLayoutState = atomWithStorage<'list' | 'split'>(
  'inboxLayoutState',
  'list',
);

export const showConversationsState = atomWithStorage<boolean>(
  'showConversationsState',
  false,
);

export const selectMainFilterState = atom(
  (get) => get(inboxLayoutState) === 'split' && get(showConversationsState),
  (get, set, payload?: boolean) =>
    get(inboxLayoutState) === 'split' &&
    set(showConversationsState, isUndefinedOrNull(payload) ? true : payload),
);
