import { z } from 'zod';
import {
  USER_SUBMIT_SCHEMA,
  USER_DETAIL_SCHEMA,
} from '@/settings/team-member/schema/users';

export interface IUsersDetails {
  avatar: string;
  fullName: string;
  firstName: string;
  lastName: string;
  workStartedDate: Date;
}
export enum EStatus {
  Verified = 'Verified',
  NotVerified = 'Not verified',
}

export interface IUser {
  _id: string;
  details: IUsersDetails;
  email: string;
  status: EStatus;
  employeeId: string;
  isActive: boolean;
  positionIds: string[];
}

export interface IUserEntry {
  email: string;
  password: string;
  groupId: string;
  unitId?: string;
  branchId?: string;
  departmentId?: string;
}

export type TUserInviteVars = {
  entries: IUserEntry[];
};
export interface IUserInviteContext {
  selectedUsers: string[];
  setSelectedUsers: (selectedUsers: string[]) => void;
  fields: IUserEntry & { id: string }[];
}
export interface IInviteUserRowContext {
  userIndex: number;
  user: IUserEntry & { id: string };
}
export interface IBranch {
  _id: string;
  title: string;
  code: string;
  parentId: string;
}
export type TUserForm = z.infer<typeof USER_SUBMIT_SCHEMA>;
export type TUserDetailForm = z.infer<typeof USER_DETAIL_SCHEMA>;
