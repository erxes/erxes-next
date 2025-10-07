import { z } from 'zod';
import { TablerIcon } from '@tabler/icons-react';
import { ticketSchema } from './schema';

export interface IHeaderItem {
  Icon: TablerIcon;
  title: string;
  value: string;
  disabled?: boolean;
}

export type TicketsFormData = z.infer<typeof ticketSchema>;

export type TabType = 'ticket' | 'chat' | 'faq' | 'call' | 'bug' | '';

export interface Message {
  id: string;
  content: string;
  sender: 'customer' | 'operator';
  timestamp: Date;
  avatar?: string;
}

export interface Conversation {
  id: string;
  messages: Message[];
  isActive: boolean;
  lastMessage?: Message;
}