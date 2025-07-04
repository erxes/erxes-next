export const facebookConstants = {
  actions: [
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
      moduleName: 'facebook',
      name: 'facebook-messenger-bots',
      label: 'Facebook Messenger',
      description: 'Generate Facebook Messenger Bots',
      logo: '/images/integrations/fb-messenger.png',
      totalCountQueryName: 'facebookMessengerBotsTotalCount',
    },
  ],
};
