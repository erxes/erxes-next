import { incomingWebhookHandler } from '@/executions/actions/webhook/incoming/incomingWebhookHandler';
import { incomingWebhookHealthHandler } from '@/executions/actions/webhook/incoming/incomingWebhookHealthHandler';
import {
  continueRateLimit,
  webhookRateLimit,
} from '@/executions/actions/webhook/incoming/rateLimits';
import { waitingWebhookExecutionHandler } from '@/executions/actions/webhook/incoming/waitingWebhookExecutionHandler';
import express, { Router } from 'express';
import helmet from 'helmet';

export const incomingWebhookRouter: Router = express.Router();

incomingWebhookRouter.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    hidePoweredBy: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }),
);

const rawBodyMiddleware = express.raw({
  type: '*/*',
  limit: '1mb', // limit payload to reasonable size
});
// Enterprise rate limiting

//   // Secure body parser with limits
//   const webhookBodyParser = bodyParser({
//     limit: '10mb', // Prevent DoS with large payloads
//     verify: (req: any, res: any, buf: Buffer) => {
//       // Store raw body for signature verification
//       (req as any).rawBody = buf;
//     },
//   });

// HMAC signature verification
//   const verifyHMACSignature = (req: express.Request, secret: string): boolean => {
//     const signature = req.headers['x-hub-signature-256'] ||
//                      req.headers['x-signature'] ||
//                      req.headers['signature'];

//     if (!signature) return false;

//     const expectedSignature = `sha256=${crypto
//       .createHmac('sha256', secret)
//       .update((req as any).rawBody || '')
//       .digest('hex')}`;

//     return crypto.timingSafeEqual(
//       Buffer.from(Array.isArray(signature) ? signature[0] : signature),
//       Buffer.from(expectedSignature)
//     );
//   };

incomingWebhookRouter.all('/:id/*', webhookRateLimit, incomingWebhookHandler);

// Health check endpoint for webhook route
incomingWebhookRouter.get('/:id/health', incomingWebhookHealthHandler);

incomingWebhookRouter.get(
  '/executions/:executionId/continue/*',
  rawBodyMiddleware,
  continueRateLimit,
  waitingWebhookExecutionHandler,
);
