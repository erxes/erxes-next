import { SlashMenuProps } from 'erxes-ui';

export interface IMember {
  _id: string;
  email?: string;
  username?: string;
  details: {
    fullName: string;
    avatar: string;
  };
}
export interface IMemberGroup {
  _id: string;
  name: string;
  members: IMember[];
  description: string;
}

export interface IMemberGroupContext {
  selectedUsersGroup: IMemberGroup | undefined;
  setSelectedUsersGroup: (usersGroup: IMemberGroup) => void;
}

export interface MentionMenuProps extends SlashMenuProps {
  loading: boolean;
  users: IMember[];
  handleFetchMore: () => void;
  totalCount: number;
}
