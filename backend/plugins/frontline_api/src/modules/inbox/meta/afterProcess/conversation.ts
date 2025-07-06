import { sendNotification } from 'erxes-api-shared/core-modules';
import { IAfterProcessRule } from 'erxes-api-shared/utils';
import { IModels } from '~/connectionResolvers';
import {
  IConversation,
  IConversationDocument,
} from '~/modules/inbox/@types/conversations';
import { conversationNotifReceivers } from '~/modules/inbox/graphql/resolvers/mutations/conversations';

export const conversationAfterProcessWorkers = {
  rules: [
    {
      type: 'updatedDocument',
      contentTypes: ['frontline:inbox.conversation'],
    },
  ] as IAfterProcessRule[],
  onDocumentUpdated: async (
    subdomain: string,
    models: IModels,
    data: {
      collectionName: string;
      fullDocument: IConversationDocument;
      prevDocument: any;
      updateDescription: {
        updatedFields: { [key: string]: any };
        removedFields: string[];
      };
    },
  ) => {
    console.log('frontline', data);
    const { collectionName, fullDocument, updateDescription } = data || {};
    const { updatedFields } = updateDescription || {};

    if (collectionName === 'conversations') {
      if (updatedFields.status === 'closed') {
        console.log('yeah ');
        sendNotification(subdomain, {
          title: 'Conversation Resolved',
          message: `changed conversation status to ${(
            fullDocument.status || ''
          ).toUpperCase()}`,
          type: 'info',
          fromUserId: fullDocument.closedUserId,
          userIds: conversationNotifReceivers(
            fullDocument,
            fullDocument?.closedUserId || '',
          ),
          contentType: 'frontline:inbox.conversation',
          contentTypeId: fullDocument._id,
          action: 'resolved',
          priority: 'medium',
        });
      }
    }
  },
};
