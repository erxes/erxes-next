import { z } from 'zod';

const commonFields = z.object({
  COMPANY_EMAIL_FROM: z.string(),
  COMPANY_EMAIL_TEMPLATE_TYPE: z.string().default('simple'),
  COMPANY_EMAIL_TEMPLATE: z.string(),
});

const customMailServiceSchema = commonFields.extend({
  DEFAULT_EMAIL_SERVICE: z.literal('custom'),
  MAIL_SERVICE: z.string(),
  MAIL_PORT: z.string(),
  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),
  MAIL_HOST: z.string(),
});

const awsSESSchema = commonFields.extend({
  DEFAULT_EMAIL_SERVICE: z.literal('SES'),
  AWS_SES_ACCESS_KEY_ID: z.string(),
  AWS_SES_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  AWS_SES_CONFIG_SET: z.string(),
});

const mailConfigSchema = z.discriminatedUnion('DEFAULT_EMAIL_SERVICE', [
  customMailServiceSchema,
  awsSESSchema,
]);

export { mailConfigSchema };
