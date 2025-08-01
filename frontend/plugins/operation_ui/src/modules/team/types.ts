import { TEAM_FORM_SCHEMA } from '~/modules/team/schemas';
import { z } from 'zod';

export enum TeamHotKeyScope {
  TeamSettingsPage = 'operation-team-page',
  TeamCreateSheet = 'operation-add-team',
}

export interface ITeam {
  _id: string;
  name: string;
  icon: string;
  description: string;
  memberIds: string[];
  createdAt: string;
  updatedAt: string;

  taskCount: number;
}

export type TTeamForm = z.infer<typeof TEAM_FORM_SCHEMA>;
