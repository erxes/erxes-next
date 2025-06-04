export interface ITeacher {
  _id: string;
  userId: string;
  user: IUser;
}

export interface IUser {
  _id: string;
  details: IUsersDetails;
  email: string;
  isActive: boolean;
  employeeId?: string;
}

export interface IUsersDetails {
  avatar: string;
  fullName: string;
  firstName: string;
  lastName: string;
  operatorPhone: string;
}
