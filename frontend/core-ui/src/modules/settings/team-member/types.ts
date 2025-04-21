import { z } from 'zod';
import { USER_SCHEMA } from '@/settings/team-member/schema/users';

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

export interface IUserEntry {
  email: string;
  password: string;
  groupId: string;
  channelIds?: string[];
  unitId?: string;
  branchId?: string;
  departmentId?: string;
}

export type TUserInviteVars = {
  entries: IUserEntry[];
};
export interface IBranch {
  _id: string;
  title: string;
  code: string;
  parentId: string;
}
export type TUserForm = z.infer<typeof USER_SCHEMA>;
