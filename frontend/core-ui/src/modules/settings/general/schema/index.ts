import { z } from 'zod';

const generalSettingsSchema = z.object({
  languageCode: z.string(),
  dealCurrency: z.string().array(),
  CHECK_TEAM_MEMBER_SHOWN: z.boolean(),
  BRANCHES_MASTER_TEAM_MEMBERS_IDS: z.string().array(),
  DEPARTMENTS_MASTER_TEAM_MEMBERS_IDS: z.string().array(),
});

export { generalSettingsSchema };
