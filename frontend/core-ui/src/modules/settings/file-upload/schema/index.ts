import { z } from 'zod';

const COMMON_FILE_UPLOAD_FIELDS = {
  UPLOAD_FILE_TYPES: z.array(z.object({ label: z.string(), value: z.string() })),
  WIDGETS_UPLOAD_FILE_TYPES: z.array(z.object({ label: z.string(), value: z.string() })),
  FILE_SYSTEM_PUBLIC: z.string(),
};

const AWS_FIELDS_SCHEMA = z.object({
  UPLOAD_SERVICE_TYPE: z.literal('AWS'),
  ...COMMON_FILE_UPLOAD_FIELDS,
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

const GCS_FIELDS_SCHEMA = z.object({
  UPLOAD_SERVICE_TYPE: z.literal('GCS'),
  ...COMMON_FILE_UPLOAD_FIELDS,
  GCS_BUCKET: z
    .string()
    .min(3, { message: 'Bucket name must be at least 3 characters.' })
    .max(63, { message: 'Bucket name must be at most 63 characters.' }),
});

const CLOUDFLARE_FIELDS_SCHEMA = z.object({
  UPLOAD_SERVICE_TYPE: z.literal('CLOUDFLARE'),
  ...COMMON_FILE_UPLOAD_FIELDS,
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  CLOUDFLARE_API_TOKEN: z.string(),
  CLOUDFLARE_ACCESS_KEY_ID: z.string(),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
  CLOUDFLARE_BUCKET_NAME: z.string(),
  CLOUDFLARE_ACCOUNT_HASH: z.string(),
  CLOUDFLARE_USE_CDN: z.boolean(),
});

const AZURE_FIELDS_SCHEMA = z.object({
  UPLOAD_SERVICE_TYPE: z.literal('AZURE'),
  ...COMMON_FILE_UPLOAD_FIELDS,
  ABS_CONTAINER_NAME: z.string(),
  AB_CONNECTION_STRING: z.string(),
});

const FILES_VALIDATION_SCHEMA = z.discriminatedUnion('UPLOAD_SERVICE_TYPE', [
  AWS_FIELDS_SCHEMA,
  GCS_FIELDS_SCHEMA,
  CLOUDFLARE_FIELDS_SCHEMA,
  AZURE_FIELDS_SCHEMA,
]);

export {
  FILES_VALIDATION_SCHEMA
}