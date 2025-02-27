export interface IUserDetail {
  _id: string;
  email: string;
  username: string;
  details: {
    avatar: string;
    fullName: string;
  };
}

export interface Props {
  onCompleted: (userDetail: Partial<IUserDetail>) => void;
}
