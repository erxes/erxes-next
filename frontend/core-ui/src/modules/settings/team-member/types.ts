export interface IUsersDetails {
  avatar: string;
  fullName: string;
  firstName: string;
  lastName: string;
  position: string;
  workStartedDate: string;
}
export enum EStatus {
  Verified = 'Verified',
  NotVerified = 'Not verified',
}

export interface IUser {
  _id: string;
  details: IUsersDetails;
  status: EStatus;
  email: string;
  employeeId: string;
  isActive: boolean;
}
