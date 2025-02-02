import { createState } from './createState';

export const isCurrentOrganizationLoadedState = createState<boolean>({
  key: 'isCurrentOrganizationLoadedState',
  defaultValue: false,
});
