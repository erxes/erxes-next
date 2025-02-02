import { z } from 'zod';

const commonFields = {
  UPLOAD_FILE_TYPES: z.array(z.object({ label: z.string(), value: z.string() })),
  WIDGETS_UPLOAD_FILE_TYPES: z.array(z.object({ label: z.string(), value: z.string() })),
  FILE_SYSTEM_PUBLIC: z.string(),
};

const awsFields = z.object({
  UPLOAD_SERVICE_TYPE: z.literal('AWS'),
  ...commonFields,
  AWS_ACCESS_KEY_ID: z
    .string()
    .min(16, { message: 'Access key id must be at least 16 characters.' })
    .max(128, { message: 'Access key id must be at most 128 characters.' }),
  AWS_SECRET_ACCESS_KEY: z
    .string()
    .min(16, { message: 'Secret access key must be at least 16 characters.' })
    .max(128, { message: 'Secret access key must be at most 128 characters.' }),
  AWS_BUCKET: z
    .string()
    .min(3, { message: 'Bucket name must be at least 3 characters.' })
    .max(63, { message: 'Bucket name must be at most 63 characters.' }),
  AWS_PREFIX: z.string().optional(),
  AWS_COMPATIBLE_SERVICE_ENDPOINT: z.string().optional(),
  AWS_FORCE_PATH_STYLE: z.string().optional(),
});

const gcsFields = z.object({
  UPLOAD_SERVICE_TYPE: z.literal('GCS'),
  ...commonFields,
  GCS_BUCKET: z
    .string()
    .min(3, { message: 'Bucket name must be at least 3 characters.' })
    .max(63, { message: 'Bucket name must be at most 63 characters.' }),
});

const cloudflareFields = z.object({
  UPLOAD_SERVICE_TYPE: z.literal('CLOUDFLARE'),
  ...commonFields,
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  CLOUDFLARE_API_TOKEN: z.string(),
  CLOUDFLARE_ACCESS_KEY_ID: z.string(),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
  CLOUDFLARE_BUCKET_NAME: z.string(),
  CLOUDFLARE_ACCOUNT_HASH: z.string(),
  CLOUDFLARE_USE_CDN: z.boolean(),
});

const azureFields = z.object({
  UPLOAD_SERVICE_TYPE: z.literal('AZURE'),
  ...commonFields,
  ABS_CONTAINER_NAME: z.string(),
  AB_CONNECTION_STRING: z.string(),
});

const filesValidationSchema = z.discriminatedUnion('UPLOAD_SERVICE_TYPE', [
  awsFields,
  gcsFields,
  cloudflareFields,
  azureFields,
]);

export {
  filesValidationSchema
}