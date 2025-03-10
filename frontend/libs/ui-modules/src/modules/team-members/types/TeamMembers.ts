import { SlashMenuProps } from 'erxes-ui';

export interface AssignMemberFetchMoreProps {
  fetchMore: () => void;
  usersLength: number;
  totalCount: number;
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface IMember {
  _id: string;
  details: {
    fullName: string;
    avatar: string;
  };
}

export interface MentionMenuProps extends SlashMenuProps {
  loading: boolean;
  users: IMember[];
  handleFetchMore: () => void;
  totalCount: number;
}
