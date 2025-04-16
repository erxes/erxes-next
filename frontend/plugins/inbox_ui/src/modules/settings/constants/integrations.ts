import {
  FacebookIcon,
  InstagramIcon,
  MessengerIcon,
  WhatspappIcon,
} from '~/modules/inbox/components/Icons';

export const INTEGRATIONS = {
  messenger: {
    Icon: MessengerIcon,
    label: 'Messenger',
    description: 'See and reply to Messenger messages in your Team Inbox',
  },
  'facebook-messenger': {
    Icon: MessengerIcon,
    label: 'Facebook Messenger',
    description:
      'Connect and manage Facebook Messages right from your Team Inbox',
  },
  'facebook-post': {
    Icon: FacebookIcon,
    label: 'Facebook Post',
    description: 'Connect to Facebook posts right from your Team Inbox',
  },
  'instagram-post': {
    Icon: InstagramIcon,
    label: 'Instagram Post',
    description: 'Connect to Instagram posts right from your Team Inbox',
  },
  'instagram-messenger': {
    Icon: InstagramIcon,
    label: "Instagram DM's",
    description: 'Connect to Instagram posts right from your Team Inbox',
  },
  callpro: {
    Icon: MessengerIcon,
    label: 'Call Pro',
    description: 'Connect your call pro phone number',
  },
  whatsapp: {
    Icon: WhatspappIcon,
    label: 'Whatsapp',
    description: 'Connect and manage Whats App right from your Team Inbox',
  },
};

export const OTHER_INTEGRATIONS = {
  webhook: {
    Icon: MessengerIcon,
    label: 'Incoming Webhook',
    description: 'Configure incoming webhooks',
  },
  calls: {
    Icon: MessengerIcon,
    label: 'Grand stream',
    description: 'Configure Grand stream device',
  },
  imap: {
    Icon: MessengerIcon,
    label: 'IMAP',
    description:
      'Connect a company email address such as sales@mycompany.com or info@mycompany.com',
  },
  cloudflarecalls: {
    Icon: MessengerIcon,
    label: 'Web call',
    description: 'Configure Web Call',
  },
};
