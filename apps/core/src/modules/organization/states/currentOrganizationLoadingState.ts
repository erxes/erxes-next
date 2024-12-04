import { createState } from 'erxes-ui';

export const isCurrentOrganizationLoadedState = createState<boolean>({
  key: 'isCurrentOrganizationLoadedState',
  defaultValue: false,
});
