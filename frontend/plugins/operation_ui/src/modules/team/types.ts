import { TEAM_FORM_SCHEMA } from '~/modules/team/schemas';
import { z } from 'zod';

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

export type TTeamForm = z.infer<typeof TEAM_FORM_SCHEMA>;
