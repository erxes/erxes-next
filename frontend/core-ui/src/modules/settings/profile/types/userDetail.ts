export interface IUsersDetail {
  _id: string;
  email: string;
  username: string;
  details: {
    avatar: string;
    fullName: string;
  };
}

export interface Props {
  onCompleted: (GET_USER_DETAIL: Partial<IUsersDetail>) => void;
}
