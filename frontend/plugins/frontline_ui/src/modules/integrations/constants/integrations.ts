import { IntegrationType } from '@/types/Integration';

export const INTEGRATIONS = {
  [IntegrationType.ERXES_MESSENGER]: {
    name: 'erxes Messenger',
    description:
      'Connect and manage Facebook Messages right from your Team Inbox',
    img: '/images/integrations/erxes-messenger.png',
  },
  [IntegrationType.FACEBOOK_MESSENGER]: {
    name: 'Facebook Messenger',
    description:
      'Connect and manage Facebook Messages right from your Team Inbox',
    img: '/images/integrations/facebook-messenger.png',
  },
};
