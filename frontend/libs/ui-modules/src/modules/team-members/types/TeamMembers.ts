import { SlashMenuProps } from 'erxes-ui';
import { USERS_GROUP_FORM_SCHEAMA } from 'frontend/core-ui/src/modules/settings/permission/schema/usersGroup';
import { z } from 'zod';

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
  description: string;
  members?: IUser[];
  memberIds?: string[];
}

export interface IUserGroupContext {
  groupsIds: string[];
  onSelect: (group: IUserGroup) => void;
  usersGroups: IUserGroup[];
  setUsersGroups: (usersGroups: IUserGroup[]) => void;
  loading: boolean;
  error: string | null;
}

export interface MentionMenuProps extends SlashMenuProps {
  loading: boolean;
  users: IUser[];
  handleFetchMore: () => void;
  totalCount: number;
}
