import { TablerIcon } from '@tabler/icons-react';
import { ticketSchema } from './schema/ticket';
import { z } from 'zod';

export interface IHeaderItem {
  Icon: TablerIcon;
  title?: string;
  value?: string;
}

export type TicketsFormData = z.infer<typeof ticketSchema>;
