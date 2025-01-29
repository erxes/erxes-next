export interface Customer {
  _id: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  primaryEmail?: string;
}

export interface SelectUserFetchMoreProps {
  fetchMore: () => void;
  usersLength: number;
  totalCount: number;
}