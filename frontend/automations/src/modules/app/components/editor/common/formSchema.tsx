import { z } from 'zod';

const formSchema = z.object({
  isMinimized: z.boolean(),
  activeTab: z.string().min(1),
  activeNode: z.any(),
  detail: z.object({
    name: z.string(),
    status: z.string(z.enum(['active', 'draft'])),
    triggers: z.array(
      z
        .object({
          id: z.string(),
          type: z.string(),
          actionId: z.string().optional(),
          config: z.any(),
          icon: z.any(),
          label: z.string(),
          description: z.string(),
          isCustom: z.boolean().default(false).readonly().optional(),
          position: z
            .object({
              x: z.number(),
              y: z.number(),
            })
            .optional(),
        })
        .refine(({ config, isCustom }) => !isCustom && config?.contentId, {
          path: ['config'],
          message: 'Each non-custom trigger must include a config with segment',
        }),
    ),
    actions: z.array(
      z.object({
        id: z.string(),
        type: z.string(),
        config: z.record(z.any(), {
          message: 'Action configuration must not be empty',
        }),
        icon: z.any(),
        nextActionId: z.string().default('').optional(),
        label: z.string(),
        description: z.string(),
        isCustom: z.boolean().readonly().optional(),
        position: z
          .object({
            x: z.number(),
            y: z.number(),
          })
          .optional(),
      }),
    ),
  }),
});

export type TAutomationProps = z.infer<typeof formSchema>;

export default formSchema;
