import { Document } from 'mongoose';

export interface ITeam {
  icon: string;
  memberIds: string[];
  name: string;
  description: string;
}

export interface ITeamDocument extends ITeam, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ITeamFilter = ITeam;
