import { Document } from 'mongoose';

export interface ITeam {
  icon: string;
  name: string;
  description: string;
  estimateType: number;
}

export interface ITeamDocument extends ITeam, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ITeamFilter = ITeam;

export enum TeamMember {
  ADMIN = 'admin',
  MEMBER = 'member',
  LEAD = 'lead',
}

export interface ITeamMember {
  memberId: string;
  teamId: string;
  role: TeamMember;
}

export interface ITeamMemberDocument extends ITeamMember, Document {
  _id: string;
}
