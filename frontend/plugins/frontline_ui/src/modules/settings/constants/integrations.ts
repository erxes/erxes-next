import {
  FacebookIcon,
  InstagramIcon,
  MessengerIcon,
  WhatsAppIcon,
} from '~/modules/inbox/components/Icons';

export const INTEGRATIONS = {
  messenger: {
    img: '/assets/messenger.webp',
    label: 'Messenger',
    description: 'See and reply to Messenger messages in your Team Inbox',
  },
  'facebook-messenger': {
    img: '/assets/fb-messenger.webp',
    label: 'Facebook Messenger',
    description:
      'Connect and manage Facebook Messages right from your Team Inbox',
  },
  'facebook-post': {
    img: '/assets/facebook.webp',
    label: 'Facebook Post',
    description: 'Connect to Facebook posts right from your Team Inbox',
  },
  'instagram-post': {
    img: '/assets/instagram.webp',
    label: 'Instagram Post',
    description: 'Connect to Instagram posts right from your Team Inbox',
  },
  'instagram-messenger': {
    img: '/assets/instagram.webp',
    label: "Instagram DM's",
    description:
      'Connect and manage Instagram direct messages right from your Team Inbox',
  },
  callpro: {
    img: '/assets/callpro.webp',
    label: 'Call Pro',
    description: 'Connect your call pro phone number',
  },
  whatsapp: {
    img: '/assets/whatsapp.webp',
    label: 'Whatsapp',
    description: 'Connect and manage Whats App right from your Team Inbox',
  },
};

export const OTHER_INTEGRATIONS = {
  webhook: {
    img: '/assets/incoming-webhook.webp',
    label: 'Incoming Webhook',
    description: 'Configure incoming webhooks',
  },
  calls: {
    img: '/assets/grandstream.webp',
    label: 'Grand stream',
    description: 'Configure Grand stream device',
  },
  imap: {
    img: '/assets/email.webp',
    label: 'IMAP',
    description:
      'Connect a company email address such as sales@mycompany.com or info@mycompany.com',
  },
  cloudflarecalls: {
    img: '/assets/email.webp',
    label: 'Web call',
    description: 'Configure Web Call',
  },
};
