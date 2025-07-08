import { SlashMenuProps } from 'erxes-ui';

export interface IUser {
  _id: string;
  email?: string;
  username?: string;
  details?: {
    fullName?: string;
    avatar?: string;
  };
}
export interface IUserGroup {
  _id: string;
  name: string;
  members: IUser[];
  description: string;
}

export interface IUserGroupContext {
  selectedUsersGroup: IUserGroup | undefined;
  setSelectedUsersGroup: (usersGroup: IUserGroup) => void;
}

export interface MentionMenuProps extends SlashMenuProps {
  loading: boolean;
  users: IUser[];
  handleFetchMore: () => void;
  totalCount: number;
}
