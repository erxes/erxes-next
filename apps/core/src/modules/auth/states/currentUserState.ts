import { createState } from 'erxes-ui';

export type CurrentUser = {
  _id: string;
  email: string;
  username: string;
  details: {
    avatar: string;
    fullName: string;
  };
};

export const currentUserState = createState<CurrentUser | null>({
  key: 'currentUserState',
  defaultValue: null,
});
