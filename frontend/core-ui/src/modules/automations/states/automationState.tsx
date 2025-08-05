import { atom } from 'jotai';

export const automationBuilderActiveTabState = atom<'builder' | 'history'>(
  'builder',
);

export const automationBuilderSiderbarOpenState = atom<boolean>(true);

export const automationBuilderPanelOpenState = atom<boolean>(false);

export const toggleAutomationBuilderOpenSidebar = atom(true, (get, set) => {
  const isOpen = get(automationBuilderSiderbarOpenState);

  set(automationBuilderSiderbarOpenState, !isOpen);
});

export const toggleAutomationBuilderOpenPanel = atom(false, (get, set) => {
  const isOpen = get(automationBuilderPanelOpenState);

  set(automationBuilderPanelOpenState, !isOpen);
});
