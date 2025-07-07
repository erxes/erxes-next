import { atomWithStorage } from 'jotai/utils';
import { ICallConfigDoc } from '@/integrations/call/types/callTypes';

export const callConfigAtom = atomWithStorage<ICallConfigDoc | null>(
  'config:call_integrations',
  null,
  undefined,
  { getOnInit: true },
);

export const callInfoAtom = atomWithStorage<{
  isUnregistered?: boolean;
  isRegistered?: boolean;
} | null>('callInfo', null, undefined, { getOnInit: true });
