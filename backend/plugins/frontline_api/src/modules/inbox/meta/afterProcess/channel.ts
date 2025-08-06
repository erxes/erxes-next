import {
  INotificationData,
  sendNotification,
} from 'erxes-api-shared/core-modules';
import { IAfterProcessRule } from 'erxes-api-shared/utils';
import { IModels } from '~/connectionResolvers';
import { IChannelDocument } from '~/modules/inbox/@types/channels';

export const channelAfterProcessWorkers = {
  rules: [
    {
      type: 'updatedDocument',
      contentTypes: ['frontline:inbox.channel'],
      when: {
        fieldsUpdated: ['memberIds'],
      },
    },
  ] as IAfterProcessRule[],
  onDocumentUpdated: async (
    subdomain: string,
    models: IModels,
    data: {
      collectionName: string;
      fullDocument: { _id: string } & IChannelDocument;
      prevDocument: { _id: string } & IChannelDocument;
      updateDescription: {
        updatedFields: { [key: string]: any };
        removedFields: string[];
      };
    },
  ) => {
    const { collectionName, fullDocument, updateDescription, prevDocument } =
      data || {};
    const { updatedFields } = updateDescription || {};

    if (collectionName === 'channels') {
      const updatedMemberIds: string[] = updatedFields.memberIds || [];
      const prevMemberIds: string[] = prevDocument?.memberIds || [];
      const addedMemnberIds: string[] = updatedMemberIds.filter(
        (memberId) => !prevMemberIds.includes(memberId),
      );
      const removeMemberIds = prevMemberIds.filter(
        (memberId) => !updatedMemberIds.includes(memberId),
      );

      if (addedMemnberIds.length) {
        sendNotification(subdomain, {
          title: 'Assigned on Channel',
          message: `You assigned on ${fullDocument.name} channel`,
          type: 'info',
          fromUserId: 'OQgac3z4G3I2LW9QPpAtL',
          userIds: addedMemnberIds,
          contentType: 'frontline:inbox.channel',
          contentTypeId: fullDocument._id,
          action: 'resolved',
          priority: 'medium',
          notificationType: 'channelMembersChange',
        });
      }

      if (removeMemberIds.length) {
        sendNotification(subdomain, {
          title: 'Removed from Channel',
          message: `You removed from ${fullDocument.name} channel`,
          type: 'info',
          fromUserId: 'OQgac3z4G3I2LW9QPpAtL',
          userIds: removeMemberIds,
          contentType: 'frontline:inbox.channel',
          contentTypeId: fullDocument._id,
          action: 'resolved',
          priority: 'medium',
          notificationType: 'channelMembersChange',
        });
      }
    }
  },
};
