import { z } from 'zod';

const commonFields = {
  COMPANY_EMAIL_FROM: z.string().email("Invalid email format"),
  COMPANY_EMAIL_TEMPLATE_TYPE: z.string(),
  COMPANY_EMAIL_TEMPLATE: z.string(),
};

const awsSesFields = z.object({
  DEFAULT_EMAIL_SERVICE: z.literal('SES'),
  ...commonFields,
  AWS_SES_ACCESS_KEY_ID: z
    .string()
    .min(16, { message: 'Access key id must be at least 16 characters.' })
    .max(128, { message: 'Access key id must be at most 128 characters.' }),
  AWS_SES_SECRET_ACCESS_KEY: z
    .string()
    .min(16, { message: 'Secret access key must be at least 16 characters.' })
    .max(128, { message: 'Secret access key must be at most 128 characters.' }),
  AWS_REGION: z.string(),
  AWS_SES_CONFIG_SET: z.string(),
});

const customServiceFields = z.object({
  DEFAULT_EMAIL_SERVICE: z.literal('custom'),
  ...commonFields,
  MAIL_SERVICE: z.string(),
  MAIL_PORT: z.string(),
  MAIL_USER: z.string(),
  MAIL_PASS: z.string(),
  MAIL_HOST: z.string()
});


const mailServiceValidationSchema = z.discriminatedUnion('DEFAULT_EMAIL_SERVICE', [
  awsSesFields,
  customServiceFields
]);

export {
  mailServiceValidationSchema
}