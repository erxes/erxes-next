import { TablerIcon } from '@tabler/icons-react';
import { ticketSchema } from './schema';
import { z } from 'zod';

export interface IHeaderItem {
  Icon: TablerIcon;
  title: string;
  value: string;
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

export interface MessengerProps {
  brandId?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}
