import { atomWithStorage } from 'jotai/utils';

export const mainSidebarOpenState = atomWithStorage(
  'mainSidebarOpenState',
  true,
);
