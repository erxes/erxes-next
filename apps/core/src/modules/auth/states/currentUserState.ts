import { createState } from 'erxes-ui';
export type CurrentUser = any;

export const currentUserState = createState<CurrentUser | null>({
  key: 'currentUserState',
  defaultValue: null,
});
