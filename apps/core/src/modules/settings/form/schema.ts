import { z } from 'zod';

type serviceTypeT = {
  name: string,
  fields?: {
    label: string;
    name: string;
    type: string;
  },
  form?: any;
}

const serviceFields = {
  local: {
    name: "local",
    fields: []
  },
  AWS: {
    name: "AWS",
    fields: [
      { label: 'AWS Access Key Id', name: 'AWS_ACCESS_KEY_ID', type: 'text' },
      { label: 'AWS Secret Access Key', name: 'AWS_SECRET_ACCESS_KEY', type: 'text' },
      { label: 'AWS Bucket', name: 'AWS_BUCKET', type: 'text' },
      { label: 'AWS Prefix', name: 'AWS_PREFIX', type: 'text' },
      { label: 'AWS Compatible Service Endpoint', name: 'AWS_COMPATIBLE_SERVICE_ENDPOINT', type: 'text' },
      { label: 'AWS Force Path Style', name: 'AWS_FORCE_PATH_STYLE', type: 'text' },
    ],
  },
  GCS: {
    name: "GCS",
    fields: [
      { label: 'Google Bucket Name', name: 'GCS_BUCKET', type: 'text' },
    ]
  },
  CLOUDFLARE: {
    name: "CLOUDFLARE",
    fields: [
      { label: 'Cloudflare Account id', name: 'CLOUDFLARE_ACCOUNT_ID', type: 'text' },
      { label: 'Cloudflare API Token', name: 'CLOUDFLARE_API_TOKEN', type: 'text' },
      { label: 'Cloudflare Access Key id', name: 'CLOUDFLARE_ACCESS_KEY_ID', type: 'text' },
      { label: 'Cloudflare Secret Access Key', name: 'CLOUDFLARE_SECRET_ACCESS_KEY', type: 'text' },
      { label: 'Cloudflare R2 Bucket Name', name: 'CLOUDFLARE_BUCKET_NAME', type: 'text' },
      { label: 'Cloudflare Account Hash', name: 'CLOUDFLARE_ACCOUNT_HASH', type: 'text' },
      { label: 'Use Cloudflare Images and Stream', name: 'CLOUDFLARE_USE_CDN', type: 'checkbox' },
    ]
  },
  AZURE: {
    name: "AZURE",
    fields: [
      { label: 'Container Name', name: 'ABS_CONTAINER_NAME', type: 'text' },
      { label: 'Connection String', name: 'AB_CONNECTION_STRING', type: 'text' },
    ]
  },
};


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

const validationSchema = z.discriminatedUnion('UPLOAD_SERVICE_TYPE', [
  awsFields,
  gcsFields,
  cloudflareFields,
  azureFields,
]);

type UploadConfigFormT = z.infer<typeof validationSchema>;
type DynamicFieldsT = Omit<UploadConfigFormT, 'UPLOAD_FILE_TYPES' | 'WIDGETS_UPLOAD_FILE_TYPES' | 'FILE_SYSTEM_PUBLIC'>

export {
  UploadConfigFormT,
  validationSchema,
  serviceFields,
  serviceTypeT,
  DynamicFieldsT
}