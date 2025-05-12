import { z } from 'zod';

export const conditionsSchema = z
  .array(
    z.object({
      propertyType: z.string(),
      propertyName: z.string(),
      propertyOperator: z.string(),
      propertyValue: z.any(),
    }),
  )
  .optional();

const segmentFormSchema = z.object({
  name: z.string(),
  subOf: z.string().optional(),
  description: z.string().optional(),
  config: z.record(z.any()),
  conditionSegments: z
    .array(
      z.object({
        contentType: z.string(),
        conditionsConjunction: z.enum(['and', 'or']),
        conditions: conditionsSchema,
      }),
    )
    .optional(),
  conditions: conditionsSchema,
  conditionsConjunction: z.enum(['and', 'or']),
});

export const temporarySegmentSchema = z.object({
  config: z.record(z.any()),
  conditionSegments: z
    .array(
      z.object({
        contentType: z.string(),
        conditionsConjunction: z.enum(['and', 'or']),
        conditions: conditionsSchema,
      }),
    )
    .optional(),
  conditions: conditionsSchema,
  conditionsConjunction: z.enum(['and', 'or']),
});
export default segmentFormSchema;
