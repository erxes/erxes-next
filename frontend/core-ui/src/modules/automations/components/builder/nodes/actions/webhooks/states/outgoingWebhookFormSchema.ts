import { AUTOMATION_INCOMING_WEBHOOK_API_METHODS } from '@/automations/components/builder/nodes/triggers/webhooks/constants/incomingWebhook';
import { z } from 'zod';

const outgoingWebhookQueryParamsSchema = z.object({
  name: z.string().default(''),
  value: z.string().default(''),
  type: z.enum(['fixed', 'expression']).default('fixed'),
});

const basicAuthSchema = z.object({
  type: z.literal('basic'),
  username: z.string(),
  password: z.string(),
});

const bearerAuthSchema = z.object({
  type: z.literal('bearer'),
  token: z.string(),
});

const noneAuthSchema = z.object({
  type: z.literal('none'),
});

const jwtAuthSchema = z.object({
  type: z.literal('jwt'),

  // Algorithm choice (common JWT signing algos)
  algorithm: z.enum([
    'HS256',
    'HS384',
    'HS512',
    'RS256',
    'RS384',
    'RS512',
    'ES256',
    'ES384',
    'ES512',
    'PS256',
    'PS384',
    'PS512',
    'EdDSA',
  ]),

  // Secret for symmetric (HS*) or private key for asymmetric (RS*/ES*/PS*)
  secretKey: z.string().min(1, 'Secret key is required'),

  // Optional public key (for verification in case of RS/ES/PS)
  publicKey: z.string().optional(),

  // JWT claims (optional, dynamic fields for enterprise systems)
  claims: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .default({}),

  // Token expiration handling
  expiresIn: z.string().default('1h'), // enterprise default: 1 hour

  // Audience & issuer (common in enterprise setups)
  audience: z.string().optional(),
  issuer: z.string().optional(),

  // Header customization
  header: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .optional(),
  placement: z.enum(['header', 'query', 'body']).default('header'),
});

const authSchema = z.discriminatedUnion('type', [
  noneAuthSchema,
  basicAuthSchema,
  bearerAuthSchema,
  jwtAuthSchema,
]);

const headerScheam = z.object({
  key: z.string().default(''),
  value: z.string().default(''),
  type: z.enum(['fixed', 'expression']).default('fixed'),
});

export const outgoingWebhookFormSchema = z.object({
  method: z
    .enum(AUTOMATION_INCOMING_WEBHOOK_API_METHODS as [string, ...string[]])
    .default('POST'),
  url: z.string().url(),
  queryParams: z.array(outgoingWebhookQueryParamsSchema).default([]),
  body: z.record(z.any()).default({}),
  auth: authSchema.optional(),
  headers: z.array(headerScheam).default([]),

  options: z
    .object({
      // Core options
      timeout: z.coerce.number().default(10000).optional(),
      ignoreSSL: z.boolean().default(false),
      followRedirect: z.boolean().default(true),
      maxRedirects: z.coerce.number().optional(),

      // Retry behavior
      retry: z
        .object({
          attempts: z.coerce.number().default(0), // 0 = no retry
          delay: z.coerce.number().default(1000), // in ms
          backoff: z.enum(['none', 'linear', 'exponential']).default('none'),
        })
        .default({ attempts: 0, delay: 1000, backoff: 'none' }),

      // Response handling
      responseType: z
        .enum(['json', 'text', 'arraybuffer', 'stream'])
        .default('json'),
      maxContentLength: z.coerce.number().optional(), // bytes
      validateStatus: z
        .union([
          z.array(z.number()),
          z.function().args(z.number()).returns(z.boolean()),
        ])
        .optional(),

      // Networking
      proxy: z
        .object({
          host: z.string(),
          port: z.number(),
          auth: z
            .object({
              username: z.string(),
              password: z.string(),
            })
            .optional(),
        })
        .optional(),
      keepAlive: z.boolean().default(true),
    })
    .default({
      followRedirect: true,
      keepAlive: true,
      retry: { attempts: 0, delay: 1000, backoff: 'none' },
    })
    .superRefine((opts, ctx) => {
      if (opts.followRedirect && opts.maxRedirects === undefined) {
        ctx.addIssue({
          path: ['maxRedirects'],
          code: z.ZodIssueCode.custom,
          message: 'maxRedirects is required when followRedirect is true',
        });
      }
    }),
});

export type TOutgoingWebhookForm = z.infer<typeof outgoingWebhookFormSchema>;
