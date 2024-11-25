import { createState } from 'erxes-ui';

export const isCurrentUserLoadedState = createState<boolean>({
  key: 'isCurrentUserLoadedState',
  defaultValue: false,
});
