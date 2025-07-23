import { IAfterProcessRule } from 'erxes-api-shared/utils';
import { IModels } from '~/connectionResolvers';
import { channelAfterProcessWorkers } from '~/modules/inbox/meta/afterProcess/channel';
import { conversationAfterProcessWorkers } from '~/modules/inbox/meta/afterProcess/conversation';

export const inboxAfterProcessWorkers = {
  rules: [
    ...conversationAfterProcessWorkers.rules,
    ...channelAfterProcessWorkers.rules,
  ] as IAfterProcessRule[],
  updatedDocument: {
    conversation: conversationAfterProcessWorkers.onDocumentUpdated,
    channel: channelAfterProcessWorkers.onDocumentUpdated,
  },
  createdDocument: {},
};
