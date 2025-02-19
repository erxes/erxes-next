export interface iUserDetail {
    _id: string;
    email: string;
    username: string;
    details: {
      avatar: string;
      fullName: string;
    };
  }
  
  export interface Props {
    onCompleted: (userDetail: iUserDetail) => void;
  }
  