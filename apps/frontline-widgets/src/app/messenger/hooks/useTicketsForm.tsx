import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ticketSchema } from '../schema/ticket';
import { TicketsFormData } from '../types';

export const useTicketsForm = (defaultValues?: TicketsFormData) => {
  const form = useForm<z.infer<typeof ticketSchema>>({
    resolver: zodResolver(ticketSchema),
    defaultValues: defaultValues || {
      firstName: '',
      lastName: '',
    },
    mode: 'onBlur',
  });

  return form;
};
