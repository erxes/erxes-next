import { atomWithStorage } from 'jotai/utils';

export const integrationCollapsibleState = atomWithStorage(
  'integrationCollapsibleState',
  false,
);

export const integrationKindCollapsibleState = atomWithStorage(
  'integrationKindCollapsibleState',
  false,
);
