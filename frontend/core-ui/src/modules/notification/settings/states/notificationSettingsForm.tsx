import { z } from 'zod';

export const notificationSettingsFormSchema = z.object({
  all: z.object({
    inAppNotificationsDisabled: z.boolean(),
    emailNotificationsDisabled: z.boolean(),
  }),

  plugins: z.record(
    z.object({
      isDisabled: z.boolean().optional(),
      inAppDisabled: z.boolean().optional(),
      emailDisabled: z.boolean().optional(),
      types: z
        .record(
          z.object({
            inAppDisabled: z.boolean().optional(),
            emailDisabled: z.boolean().optional(),
          }),
        )
        .optional(),
    }),
  ),
});

export type TNotificationSettingsForm = z.infer<
  typeof notificationSettingsFormSchema
>;
