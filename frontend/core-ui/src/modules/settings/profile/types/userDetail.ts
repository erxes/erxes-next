export type UserDetail = {
    _id: string;
    email: string;
    username: string;
    details: {
      avatar: string;
      fullName: string;
    };
  };
  
  export type Props = {
    onCompleted: (userDetail: UserDetail) => void;
  };