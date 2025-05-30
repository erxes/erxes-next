export interface ILink {
  [key: string]: string;
}

export interface IUsersDetails {
  avatar: string;
  fullName: string;
  firstName: string;
  lastName: string;
  operatorPhone: string;
}

export interface IStudent {
  _id: string;
  username?: string;
  password: string;
  email?: string;
  details: IUsersDetails;
  links?: ILink;
  isActive?: boolean;
  deviceTokens?: string[];
}
