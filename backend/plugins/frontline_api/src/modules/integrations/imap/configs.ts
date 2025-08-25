import * as fs from 'fs';
import * as path from 'path';
import os from 'os';
import { Base64Decode } from 'base64-stream';
import express from 'express';
import { generateModels, IModels } from '~/connectionResolvers';
import {
  getEnv,
  getSubdomain,
  getSaasOrganizations,
} from 'erxes-api-shared/utils';
import startDistributingJobs, {
  findAttachmentParts,
  createImap,
  toUpper,
  routeErrorHandling,
} from './utils';
import { debugError } from '~/modules/inbox/utils';

// Import IMAP consumers utils
import {
  imapCreateIntegrations,
  imapUpdateIntegrations,
  imapRemoveIntegrations,
  ImapListen,
  sendImapMessage,
} from './messageBroker';
import { models } from 'mongoose';

// ================= IMAP APP ===================
const initImapApp = async (app: express.Application) => {
  app.use(express.json({ limit: '15mb' }));

  // ====== Read Mail Attachment Route ======
  app.get(
    '/read-mail-attachment',
    routeErrorHandling(
      async (req, res, next) => {
        const subdomain = getSubdomain(req);

        const models = await generateModels(subdomain);

        const { messageId, integrationId, filename } = req.query as Record<
          string,
          string
        >;

        if (!messageId || !integrationId || !filename) {
          return res.status(400).send('Missing required query parameters');
        }

        const integration = await models.ImapIntegrations.findOne({
          inboxId: integrationId,
        });
        if (!integration) throw new Error('Integration not found');

        const sentMessage = await models.ImapMessages.findOne({
          messageId,
          inboxIntegrationId: integrationId,
          type: 'SENT',
        });

        const folderType = sentMessage ? '[Gmail]/Sent Mail' : 'INBOX';
        const imap = createImap(integration);

        imap.once('ready', () => {
          imap.openBox(folderType, true, (err) => {
            if (err) return next(err);

            imap.search(
              [['HEADER', 'MESSAGE-ID', messageId]],
              (err, results) => {
                if (err || !results || results.length === 0) {
                  imap.end();
                  return res.status(404).send('Message not found');
                }

                const f = imap.fetch(results, { bodies: '', struct: true });

                f.on('message', (msg) => {
                  msg.once('attributes', (attrs) => {
                    const attachments = findAttachmentParts(attrs.struct);

                    if (!attachments || attachments.length === 0) {
                      imap.end();
                      return res.status(404).send('No attachments found');
                    }

                    const attachment = attachments.find(
                      (att) => att.params?.name === filename,
                    );
                    if (!attachment) {
                      imap.end();
                      return res.status(404).send('Attachment not found');
                    }

                    const tempPath = path.join(
                      os.tmpdir(),
                      `${Date.now()}-${attachment.params.name}`,
                    );

                    const fetcher = imap.fetch(attrs.uid, {
                      bodies: [attachment.partID],
                      struct: true,
                    });

                    fetcher.on('message', (msg) => {
                      msg.on('body', (stream) => {
                        const writeStream = fs.createWriteStream(tempPath);

                        if (toUpper(attachment.encoding) === 'BASE64') {
                          stream.pipe(new Base64Decode()).pipe(writeStream);
                        } else {
                          stream.pipe(writeStream);
                        }

                        writeStream.on('finish', () => {
                          res.download(
                            tempPath,
                            attachment.params.name,
                            (err) => {
                              fs.unlink(tempPath, () => {});
                              imap.end();
                              if (err) return next(err);
                            },
                          );
                        });
                      });
                    });
                  });
                });

                f.once('error', (err) => {
                  imap.end();
                  next(err);
                });
              },
            );
          });
        });

        imap.once('error', (err) => next(err));
        imap.connect();
      },
      (res) => res.send('ok'),
    ),
  );

  // ====== Setup IMAP Consumers ======

  const setupMessageConsumers = async (subdomain: string) => {
    const models: IModels = await generateModels(subdomain);
    const integrations = await models.ImapIntegrations.find({
      healthStatus: 'healthy',
    });

    for (const integration of integrations) {
      await ImapListen({
        subdomain,
        data: { _id: (integration._id as any).toString() },
      });
    }
  };

  // ====== SaaS / OS job distribution ======
  const VERSION = getEnv({ name: 'VERSION' });

  if (VERSION === 'saas') {
    const organizations = await getSaasOrganizations();
    for (const org of organizations) {
      await setupMessageConsumers(org.subdomain);
      await startDistributingJobs(org.subdomain);
    }
  } else {
    await setupMessageConsumers('os');
    await startDistributingJobs('os');
  }

  console.log('IMAP plugin initialized successfully.');
};

export default initImapApp;
