import { SlashMenuProps } from 'erxes-ui';

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
