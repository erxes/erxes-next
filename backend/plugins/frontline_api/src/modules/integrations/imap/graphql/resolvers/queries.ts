import { IContext } from '~/connectionResolvers';

export const imapQueries = {
  async imapConversationDetail(
    _root,
    { conversationId },
    { models }: IContext
  ) {
    const messages = await models.ImapMessages.find({
      inboxConversationId: conversationId
    });

    const convertEmails = (emails) =>
      (emails || []).map((item) => ({ name: item.name, email: item.address }));

    const getNewContentFromMessageBody = (html) => {
      const startIndex = html.indexOf('<div dir="ltr">');

      if (startIndex !== -1) {
        const endIndex = html.indexOf('</div><br>', startIndex);

        if (endIndex !== -1) {
          return  html.substring(
            startIndex,
            endIndex + '</div><br>'.length
          )
        }
      }
    };

    const getRepliesFromMessageBody = (html) => {
      const startIndex = html.indexOf('<div class="gmail_quote">');

      if (startIndex !== -1) {
        const endIndex = html.lastIndexOf('</div>');

        if (endIndex !== -1) {
         return html.substring(startIndex, endIndex);
        }
      }
    };

   return messages.map((message): { _id: string, mailData: any, createdAt: Date } => {
      const msgBody =
        message.body === '<div dir="ltr">false</div>\n' || !message.body
          ? '<div dir="ltr"></div>\n'
          : message.body;

      return {
        _id: String(message._id),
        mailData: {
          messageId: message.messageId,
          from: convertEmails(message.from),
          to: convertEmails(message.to),
          cc: convertEmails(message.cc),
          bcc: convertEmails(message.bcc),
          subject: message.subject,
          body: msgBody,
          newContent: getNewContentFromMessageBody(msgBody),
          replies: getRepliesFromMessageBody(msgBody),
          attachments: message.attachments || []
        },
        createdAt: message.createdAt
      };
    });
  },

  async imapGetIntegrations(_root, _args, { models }: IContext) {
    return models.ImapIntegrations.find();
  },

};
