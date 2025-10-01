import { channelQueries } from './channels';
import { conversationQueries } from './conversations';
import { integrationQueries } from './integrations';
import { widgetQueries } from './widget';

export const queries = {
  ...channelQueries,
  ...conversationQueries,
  ...integrationQueries,
  ...widgetQueries,
};
