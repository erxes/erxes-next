import {
  TEAM_FORM_SCHEMA,
  TEAM_MEMBER_FORM_SCHEMA,
  TEAM_STATUS_FORM_SCHEMA,
} from '@/team/schemas';
import { z } from 'zod';
import { IUser } from 'ui-modules';
import { IconCircleDashed, IconCircle, IconCircleDot, IconCircleCheck, IconCircleX } from '@tabler/icons-react';

export enum TeamHotKeyScope {
  TeamSettingsPage = 'operation-team-page',
  TeamCreateSheet = 'operation-add-team',
}

export enum TeamEstimateTypes {
  NOT_IN_USE = '1',
  DEFAULT = '2',
  FIBONACCI = '3',
  EXPONENTIAL = '4',
}

export enum TeamStatusTypes {
  Backlog = 'backlog',
  Unstarted = 'unstarted',
  Started = 'started',
  Completed = 'completed',
  Cancelled = 'cancelled',
}


export const DEFAULT_TEAM_STATUSES = [
  {
    name: 'backlog',
    type: TeamStatusTypes.Backlog,
    color: '#6B7280',
    value: 0,
    Icon: IconCircleDashed
  },
  {
    name: 'todo',
    type: TeamStatusTypes.Unstarted,
    color: '#3B82F6',
    value: 1,
    Icon: IconCircle
  },
  {
    name: 'in progress',
    type: TeamStatusTypes.Started,
    color: '#F59E0B',
    value: 2,
    Icon: IconCircleDot
  },
  {
    name: 'done',
    type: TeamStatusTypes.Completed,
    color: '#10B981',
    value: 3,
    Icon: IconCircleCheck
  },
  {
    name: 'cancelled',
    type: TeamStatusTypes.Cancelled,
    color: '#EF4444',
    value: 4,
    Icon: IconCircleX
  },
];

export interface ITeam {
  _id: string;
  name: string;
  icon: string;
  description: string;
  estimateType: TeamEstimateTypes;
  createdAt: string;
  updatedAt: string;

  taskCount: number;
  memberCount: number;
}

export interface ITeamMember {
  _id: string;
  memberId: string;
  teamId: string;

  member: IUser;
  role: string;
}

export interface ITeamStatus {
  _id: string;
  name: string;
  description: string;
  color: string;
  order: number;
  type: TeamStatusTypes;
}

export type TTeamForm = z.infer<typeof TEAM_FORM_SCHEMA>;

export type TTeamMemberForm = z.infer<typeof TEAM_MEMBER_FORM_SCHEMA>;

export type TTeamStatusForm = z.infer<typeof TEAM_STATUS_FORM_SCHEMA>;
