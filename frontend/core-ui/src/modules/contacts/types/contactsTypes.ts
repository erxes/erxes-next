export interface Customer {
  _id: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  primaryEmail?: string;
  isSubscribed?: boolean;
  links?: object;
  code?: string;
  emailValidationStatus?: string;
  phoneValidationStatus?: string
  emails?: string[]
  phones?: string[] 
}

export interface SelectUserFetchMoreProps {
  fetchMore: () => void;
  usersLength: number;
  totalCount: number;
}
