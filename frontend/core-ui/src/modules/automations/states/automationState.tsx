import { atom } from 'jotai';

export const automationBuilderActiveTabState = atom<'builder' | 'history'>(
  'builder',
);

export const automationBuilderSiderbarOpenState = atom<boolean>(true);

export const toggleAutomationBuilderOpenSidebar = atom(true, (get, set) => {
  const isOpen = get(automationBuilderSiderbarOpenState);

  set(automationBuilderSiderbarOpenState, !isOpen);
});
