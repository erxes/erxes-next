import { atomWithStorage } from 'jotai/utils';

export const callWidgetPositionState = atomWithStorage<{
  x: number;
  y: number;
}>('callWidgetPosition', {
  x: 0,
  y: 0,
});
