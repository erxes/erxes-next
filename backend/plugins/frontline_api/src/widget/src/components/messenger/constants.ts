import { IHeaderItem } from './types';
import {
  IconBubbleText,
  IconSend2,
  IconPhone,
  IconBug,
} from '@tabler/icons-react';

export const HEADER_ITEMS: IHeaderItem[] = [
  {
    title: 'Issue a ticket',
    Icon: IconSend2,
    value: 'ticket',
    disabled: true,
  },
  {
    title: 'FAQ',
    Icon: IconBubbleText,
    value: 'faq',
    disabled: true,
  },
  {
    title: 'Book a call',
    Icon: IconPhone,
    value: 'call',
    disabled: true,
  },
  {
    title: 'Report a bug',
    Icon: IconBug,
    value: 'bug',
    disabled: true,
  },
];

export enum WelcomeMessage {
  TITLE = 'Need help?',
  MESSAGE = "Get help with setting up using erxes. We're available between 9.00 am and 6.00 pm (GMT +8). We'll get back to you as soon as possible.",
}
