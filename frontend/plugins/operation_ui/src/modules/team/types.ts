import { TEAM_FORM_SCHEMA } from '~/modules/team/schemas';
import { z } from 'zod';

export enum TeamHotKeyScope {
  TeamSettingsPage = 'operation-team-page',
  TeamCreateSheet = 'operation-add-team',
}

export type TTeamForm = z.infer<typeof TEAM_FORM_SCHEMA>;
