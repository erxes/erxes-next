import * as dotenv from 'dotenv';
dotenv.config();

import Imap from 'node-imap';

import { simpleParser } from 'mailparser';
import { IModels, generateModels } from '~/connectionResolvers';
import { IIntegrationImapDocument } from '~/modules/integrations/imap/models';
import { throttle } from 'lodash';
import { redlock } from '~/modules/integrations/imap/redlock';
import { sendTRPCMessage } from 'erxes-api-shared/utils';
const { NODE_ENV } = process.env;
import { receiveInboxMessage } from '@/inbox/receiveMessage';
import { pConversationClientMessageInserted } from '@/inbox/graphql/resolvers/mutations/widget';
import { sendImapMessage } from '~/modules/integrations/imap/messageBroker';
export const toUpper = (thing) => {
  return thing && thing.toUpperCase ? thing.toUpperCase() : thing;
};

export const findAttachmentParts = (struct, attachments?) => {
  attachments = attachments || [];

  for (let i = 0, len = struct.length, _r: any; i < len; ++i) {
    if (Array.isArray(struct[i])) {
      findAttachmentParts(struct[i], attachments);
    } else {
      if (
        struct[i].disposition &&
        ['INLINE', 'ATTACHMENT'].indexOf(toUpper(struct[i].disposition.type)) >
          -1
      ) {
        attachments.push(struct[i]);
      }
    }
  }
  return attachments;
};

export const createImap = (integration: IIntegrationImapDocument): Imap => {
  return new Imap({
    user: integration.mainUser || integration.user,
    password: integration.password,
    host: integration.host,
    keepalive: { forceNoop: true },
    port: 993,
    tls: true,
  });
};

const searchMessages = (imap: Imap, criteria) => {
  return new Promise((resolve, reject) => {
    const messages: string[] = [];

    imap.search(criteria, (err, results) => {
      if (err) {
        throw err;
      }

      let f: Imap.ImapFetch;

      try {
        f = imap.fetch(results, { bodies: '', struct: true });
        f.on('error', (error: any) => {
          throw error;
        });
      } catch (e) {
        if (e.message?.includes('Nothing to fetch')) {
          return resolve([]);
        }
        throw e;
      }

      f.on('message', (msg) => {
        msg.on('body', async (stream) => {
          let buffers: Buffer[] = [];

          stream.on('data', (buffer) => {
            buffers.push(buffer);
          });

          stream.once('end', async () => {
            messages.push(Buffer.concat(buffers).toString('utf8'));
          });
        });
      });

      f.once('end', async () => {
        const data: any = [];

        for (const message of messages) {
          const parsed = await simpleParser(message);
          data.push(parsed);
        }

        resolve(data);
      });
    });
  });
};

const saveMessages = async (
  subdomain: string,
  imap: Imap,
  integration: IIntegrationImapDocument,
  criteria,
  models: IModels,
) => {
  const msgs: any = await searchMessages(imap, criteria);

  console.log(`======== found ${msgs.length} messages`);

  for (const msg of msgs) {
    if (
      msg.to &&
      msg.to.value &&
      msg.to.value[0] &&
      msg.to.value[0].address !== integration.user
    ) {
      continue;
    }

    const message = await models.ImapMessages.findOne({
      messageId: msg.messageId,
    });

    if (message) {
      continue;
    }

    const from = msg.from.value[0].address;
    const prev = await models.ImapCustomers.findOne({ email: from });

    let customerId;

    if (!prev) {
      const customer = await sendTRPCMessage({
        pluginName: 'core',
        method: 'query',
        module: 'customers',
        action: 'findOne',
        input: {
          customerPrimaryEmail: from,
        },
      });

      if (customer) {
        customerId = customer._id;
      } else {
        const apiCustomerResponse = await sendTRPCMessage({
          pluginName: 'core',
          method: 'mutation',
          module: 'customers',
          action: 'createCustomer',
          input: {
            integrationId: integration.inboxId,
            primaryEmail: from,
          },
        });
        customerId = apiCustomerResponse._id;
      }

      await models.ImapCustomers.create({
        inboxIntegrationId: integration.inboxId,
        contactsId: customerId,
        email: from,
      });
    } else {
      customerId = prev.contactsId;
    }

    let conversationId;

    const $or: any[] = [
      { references: { $in: [msg.messageId] } },
      { messageId: { $in: msg.references || [] } },
    ];

    if (msg.inReplyTo) {
      $or.push({ messageId: msg.inReplyTo });
      $or.push({ references: { $in: [msg.inReplyTo] } });
    }

    const relatedMessage = await models.ImapMessages.findOne({
      $or,
    });

    if (relatedMessage) {
      conversationId = relatedMessage.inboxConversationId;
    } else {
      const data = {
        action: 'create-or-update-conversation',
        payload: JSON.stringify({
          integrationId: integration.inboxId,
          customerId,
          createdAt: msg.date,
          content: msg.subject,
        }),
      };

      const apiConversationResponse = await receiveInboxMessage(
        subdomain,
        data,
      );

      if (apiConversationResponse.status === 'success') {
        conversationId = apiConversationResponse.data._id;
      } else {
        throw new Error(
          `Conversation creation failed: ${JSON.stringify(
            apiConversationResponse,
          )}`,
        );
      }
    }

    const conversationMessage = await models.ImapMessages.create({
      inboxIntegrationId: integration.inboxId,
      inboxConversationId: conversationId,
      createdAt: msg.date,
      messageId: msg.messageId,
      inReplyTo: msg.inReplyTo,
      references: msg.references,
      subject: msg.subject,
      body: msg.html,
      to: msg.to && msg.to.value,
      cc: msg.cc && msg.cc.value,
      bcc: msg.bcc && msg.bcc.value,
      from: msg.from && msg.from.value,
      attachments: msg.attachments.map(({ filename, contentType, size }) => ({
        filename,
        type: contentType,
        size,
      })),
      type: 'INBOX',
    });

    await pConversationClientMessageInserted(subdomain, {
      _id: conversationMessage._id as string,
      content: msg.html,
      conversationId,
    });
  }
};

export const listenIntegration = async (
  subdomain: string,
  integration: IIntegrationImapDocument,
  models: IModels,
) => {
  const listen = async () => {
    let lock;
    let reconnect = true;
    let closing = false;
    let error: Error | undefined;

    try {
      lock = await redlock.lock(
        `${subdomain}:imap:integration:${integration._id}`,
        60000,
      );
    } catch (e) {
      return { reconnect: false, result: 'Already locked' };
    }

    await lock.extend(60000);

    const updatedIntegration = await models.ImapIntegrations.findById(
      integration._id,
    );
    if (!updatedIntegration) {
      console.error('Integration not found:', integration._id);
      return { reconnect: false, error: new Error('Integration not found') };
    }

    let lastFetchDate = updatedIntegration.lastFetchDate
      ? new Date(updatedIntegration.lastFetchDate)
      : new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    const imap = createImap(updatedIntegration);

    const syncEmail = async () => {
      if (closing) return;
      try {
        const criteria: any = [
          'UNSEEN',
          ['SINCE', lastFetchDate.toISOString()],
        ];
        const nextLastFetchDate = new Date();
        await saveMessages(
          subdomain,
          imap,
          updatedIntegration,
          criteria,
          models,
        );
        lastFetchDate = nextLastFetchDate;

        await models.ImapIntegrations.updateOne(
          { _id: updatedIntegration._id },
          { $set: { lastFetchDate } },
        );

        console.log(`Integration ${integration._id} synced emails`);
      } catch (e: any) {
        error = e;
        reconnect = false;
        await models.ImapLogs.createLog({
          type: 'error',
          message: 'syncEmail error:' + e.message,
          errorStack: e.stack,
        });
        imap.end();
      }
    };

    // IMAP events
    imap.once('ready', () => {
      console.log('IMAP ready for integration:', integration._id);
      imap.openBox('INBOX', true, async (e) => {
        if (e) {
          error = e;
          reconnect = false;
          closing = true;
          await models.ImapLogs.createLog({
            type: 'error',
            message: 'openBox error:' + e.message,
            errorStack: e.stack,
          });
          return imap.end();
        }
        await syncEmail();
      });
    });

    imap.on('mail', throttle(syncEmail, 30000, { leading: true }));
    imap.on('error', async (e: any) => {
      console.error('IMAP error:', e.message);
      if (closing) return;
      error = e;
      closing = true;

      if (e.message.includes('Invalid credentials')) {
        reconnect = false;
        await models.ImapIntegrations.updateOne(
          { _id: updatedIntegration._id },
          { $set: { healthStatus: 'unHealthy', error: e.message } },
        );
      }

      await models.ImapLogs.createLog({
        type: 'error',
        message: 'error event: ' + e.message,
        errorStack: e.stack,
      });
      imap.end();
    });

    const cleanupLock = async () => {
      try {
        clearInterval(lockExtendInterval);
      } catch {}
      try {
        await lock.unlock();
      } catch {}
    };

    const closeEndHandler = async () => {
      closing = true;
      try {
        imap.end();
      } catch {}
      try {
        imap.removeAllListeners();
      } catch {}
      await cleanupLock();
      return { reconnect, error };
    };

    imap.once('close', closeEndHandler);
    imap.once('end', closeEndHandler);

    imap.connect();

    const lockExtendInterval = setInterval(async () => {
      try {
        await lock.extend(60000);
      } catch (e) {
        reconnect = false;
        await cleanupLock();
        imap.end();
      }
    }, 30_000);

    return new Promise<{ reconnect: boolean; error?: Error }>((resolve) => {
      imap.once('end', () => resolve({ reconnect, error }));
    });
  };

  // Main loop
  while (true) {
    try {
      const result = await listen();
      if ('error' in result && result.error) {
        console.error(result.error);
      }

      if (!result.reconnect) break;
      await new Promise((r) => setTimeout(r, 10_000));
    } catch (e) {
      console.error(e);
      break;
    }
  }
};

const startDistributingJobs = async (subdomain: string) => {
  const models = await generateModels(subdomain);
  const distributeJob = async () => {
    let lock;
    try {
      lock = await redlock.lock(`${subdomain}:imap:work_distributor`, 60000);
    } catch (e) {
      // 1 other pod or container is already working on job distribution
      return;
    }
    try {
      await models.ImapLogs.createLog({
        type: 'info',
        message: `Distributing imap sync jobs`,
      });

      const integrations = await models.ImapIntegrations.find({
        healthStatus: 'healthy',
      });
      for (const integration of integrations) {
        sendImapMessage({
          subdomain,
          action: 'listen',
          data: {
            _id: integration._id as string,
          },
        });
      }
    } catch (e) {
      await lock.unlock();
    }
  };
  // wait for other containers to start up
  NODE_ENV === 'production' &&
    (await new Promise((resolve) => setTimeout(resolve, 60000)));

  while (true) {
    try {
      await distributeJob();
      // try doing it every 10 minutes
      await new Promise((resolve) => setTimeout(resolve, 10 * 60 * 1000));
    } catch (e) {
      console.log('distributeWork error', e);
    }
  }
};

export default startDistributingJobs;

export const routeErrorHandling = (fn, callback?: any) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (e) {
      console.log(e.message);

      if (callback) {
        return callback(res, e, next);
      }

      return next(e);
    }
  };
};
