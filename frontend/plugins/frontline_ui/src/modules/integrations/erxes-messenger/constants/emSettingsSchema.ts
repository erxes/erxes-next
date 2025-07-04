import { z } from 'zod';

export const EM_SETTINGS_SCHEMA = z.object({
  defaultLanguage: z.string().default('en'),
  requireAuthentication: z.boolean().default(false),
  showChat: z.boolean().default(true),
  showLauncher: z.boolean().default(true),
  forceLogout: z.boolean().default(false),
  notifyCustomer: z.boolean().default(false),
  showVideoCallRequest: z.boolean().default(false),
});
