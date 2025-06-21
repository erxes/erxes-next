import { AutomationConfigs } from 'erxes-api-shared/core-modules/automations/types';

export default {
  constants: {
    actions: [
      {
        type: 'frontline:inbox.messages.create',
        icon: 'Message',
        label: 'Send Erxes Messenger Message',
        description: 'Send a message through Erxes Messenger',
      },
      {
        type: 'frontline:facebook.messages.create',
        icon: 'BrandMessenger',
        label: 'Send Facebook Message',
        description: 'Send Facebook Message',
        isAvailable: true,
        isAvailableOptionalConnect: true,
      },
      {
        type: 'frontline:facebook.comments.create',
        icon: 'BubbleFilled',
        label: 'Send Facebook Comment',
        description: 'Send Facebook Comments',
        isAvailable: true,
      },
    ],
    triggers: [
      {
        type: 'frontline:inbox.conversation',
        icon: 'Message',
        label: 'Conversation',
        description:
          'Start with a blank workflow that enrolls and is triggered off conversation',
      },
      {
        type: 'frontline:inbox.messages',
        icon: 'Messages',
        label: 'Erxes Messenger ',
        description:
          'Start with a blank workflow that enrolls and is triggered off messenger messages',
        isCustom: true,
        conditions: [
          {
            type: 'getStarted',
            label: 'Get Started',
            icon: 'IconBrandMessengerFilled',
            description: 'User click on get started on the messenger',
          },
          {
            type: 'persistentMenu',
            label: 'Persistent menu',
            icon: 'IconMenu2',
            description: 'User click on persistent menu on the messenger',
          },
          {
            type: 'direct',
            icon: 'IconBrandMessenger',
            label: 'Direct Message',
            description: 'User sends direct message with keyword',
          },
        ],
      },
      {
        type: 'frontline:facebook.messages',
        connectableActionTypes: [
          'frontline:facebook.messages.create',
          'frontline:facebook.comments.create',
        ],
        icon: 'BrandMessenger',
        label: 'Facebook Message',
        description:
          'Start with a blank workflow that enrolls and is triggered off facebook messages',
        isCustom: true,
        conditions: [
          {
            type: 'getStarted',
            label: 'Get Started',
            icon: 'IconBrandMessengerFilled',

            description: 'User click on get started on the messenger',
          },
          {
            type: 'persistentMenu',
            label: 'Persistent menu',
            icon: 'IconMenu2',
            description: 'User click on persistent menu on the messenger',
          },
          {
            type: 'direct',
            icon: 'IconBrandMessenger',
            label: 'Direct Message',
            description: 'User sends direct message with keyword',
          },
        ],
      },
      {
        type: 'frontline:facebook.comments',
        icon: 'BubbleFilled',
        label: 'Facebook Comments',
        description:
          'Start with a blank workflow that enrolls and is triggered off facebook comments',
        isCustom: true,
        connectableActionTypes: [
          'frontline:facebook.messages.create',
          'frontline:facebook.comments.create',
        ],
      },
      {
        type: 'frontline:facebook.ads',
        icon: 'Speakerphone',
        label: 'Facebook Ads Message',
        description:
          'Start with a blank workflow that enrolls and is triggered off clicked send message on facebook ads',
        isCustom: true,
        connectableActionTypes: [
          'frontline:facebook.messages.create',
          'frontline:facebook.comments.create',
        ],
      },
    ],
    bots: [
      {
        name: 'facebook-messenger-bots',
        label: 'Facebook Messenger',
        description: 'Generate Facebook Messenger Bots',
        logo: '/images/integrations/fb-messenger.png',
        totalCountQueryName: 'facebootMessengerBotsTotalCount',
      },
    ],
  },
} as AutomationConfigs;
