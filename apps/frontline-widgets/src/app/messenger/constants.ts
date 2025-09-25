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
  },
  {
    title: 'FAQ',
    Icon: IconBubbleText,
    value: 'faq',
  },
  {
    title: 'Book a call',
    Icon: IconPhone,
    value: 'call',
  },
  {
    title: 'Report a bug',
    Icon: IconBug,
    value: 'bug',
  },
];
