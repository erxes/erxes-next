import { Model } from 'mongoose';
import { IModels } from '~/connectionResolvers';
import {IIMapMessageDocument } from '@/integrations/imap/@types/messages';
import * as nodemailer from 'nodemailer';
import { messageSchema} from '@/integrations/imap/db/definitions/messages'
import { sendTRPCMessage } from 'erxes-api-shared/utils';
import {ISendMailArgs} from '@/integrations/imap/@types/messages'

export interface IIMapMessageModel extends Model<IIMapMessageDocument> {
  createSendMail(
    args: ISendMailArgs,
    subdomain: string,
    models: IModels
  ): Promise<IIMapMessageDocument>;
}

export const loadImapMessageClass = (models) => {
  class Message {
    public static async createSendMail(
      args: any,
      subdomain: string,
      models: IModels
    ) {
      const {
        integrationId,
        conversationId,
        subject,
        body,
        from,
        customerId,
        to,
        attachments,
        replyToMessageId,
        shouldOpen,
        shouldResolve
      } = args;

      let customer;

      const selector = customerId
        ? { _id: customerId }
        : { status: { $ne: 'deleted' }, emails: { $in: to } };

        customer = await sendTRPCMessage({
          pluginName: 'core',
          method: 'query', 
          module: 'customers',
          action: 'findOne',
          input: { selector },
        });
      if (!customer) {
        const [primaryEmail] = to;
        customer = await sendTRPCMessage({
          pluginName: 'core',
          method: 'mutation', 
          module: 'customers',
          action: 'createCustomer',
          input: {
          doc: {
           state: 'lead',
           primaryEmail
           },
        },
        });
      }

      let integration;

      if (from) {
        integration = await models.ImapIntegrations.findOne({
          user: from
        });
      }

      if (!integration) {
        integration = await models.ImapIntegrations.findOne({
          inboxId: integrationId
        });
      }

      if (!integration && conversationId) {
        // const conversation = await sendInboxMessage({
        //   subdomain,
        //   action: 'conversations.findOne',
        //   data: { _id: conversationId },
        //   isRPC: true
        // });

        // integration = await models.ImapIntegrations.findOne({
        //   inboxId: conversation.integrationId
        // });
      }

      if (!integration) {
        throw new Error('Integration not found');
      }

      if (conversationId) {
        if (shouldResolve) {
        //   await sendInboxMessage({
        //     subdomain,
        //     action: 'conversations.changeStatus',
        //     data: { id: conversationId, status: 'closed' },
        //     isRPC: true
        //   });
        }
        if (shouldOpen) {
        //   await sendInboxMessage({
        //     subdomain,
        //     action: 'conversations.changeStatus',
        //     data: { id: conversationId, status: 'new' },
        //     isRPC: true
        //   });
        }
      }

      const transporter = nodemailer.createTransport({
        host: integration.smtpHost,
        port: integration.smtpPort,
        secure: true,
        logger: true,
        debug: true,
        auth: {
          user: integration.mainUser || integration.user,
          pass: integration.password
        }
      });

      const mailData = {
        from,
        to,
        subject: replyToMessageId ? `Re: ${subject}` : subject,
        html: body,
        inReplyTo: replyToMessageId,
        references: replyToMessageId ? [replyToMessageId] : undefined,
        attachments: attachments
          ? attachments.map((attach) => ({
              filename: attach.name,
              path: attach.url
            }))
          : [] // Default to an empty array if attachments is undefined
      };

      const info = await transporter.sendMail(mailData);

      await models.ImapMessages.create({
        inboxIntegrationId: integration.inboxId,
        inboxConversationId: conversationId,
        createdAt: new Date(),
        messageId: info.messageId,
        inReplyTo: replyToMessageId,
        references: mailData.references,
        subject: mailData.subject,
        body: mailData.html,
        to: (mailData.to || []).map((to) => ({ name: to, address: to })),
        from: [{ name: mailData.from, address: mailData.from }],
        attachments: attachments
          ? attachments.map(({ name, type, size }) => ({
              filename: name,
              type,
              size
            }))
          : [],
        type: 'SENT'
      });
      return {
        info: info
      };
    }
  }

  messageSchema.loadClass(Message);

  return messageSchema;
};