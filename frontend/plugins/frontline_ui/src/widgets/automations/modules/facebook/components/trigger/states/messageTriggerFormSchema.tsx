import { z } from 'zod';

export const triggerFormSchema = z.object({
  botId: z.string({ message: 'You should select a bot' }),
  persistentMenuIds: z.array(z.string()).optional(),
  conditions: z
    .array(
      z.object({
        _id: z.string(),
        type: z.string(),
        isSelected: z.boolean().optional(),
        persistentMenuIds: z.array(z.string()).optional(),
        conditions: z
          .array(
            z.object({
              _id: z.string(),
              operator: z.string(),
              keywords: z.array(
                z.object({
                  _id: z.string(),
                  text: z.string(),
                  isEditing: z.boolean().optional(),
                }),
              ),
            }),
          )
          .optional(),
      }),
    )
    .optional(),
});

export type TMessageTriggerForm = z.infer<typeof triggerFormSchema>;

export type TMessageTriggerFormConditions = NonNullable<
  TMessageTriggerForm['conditions']
>[number];

export type TMessageTriggerFormDirectMessage = NonNullable<
  TMessageTriggerFormConditions['conditions']
>;

export type TMessageTriggerFormPersistentMenu = NonNullable<
  TMessageTriggerFormConditions['persistentMenuIds']
>;
