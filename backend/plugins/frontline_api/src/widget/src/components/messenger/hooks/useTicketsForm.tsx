import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ticketSchema } from '../schema';
import { TicketsFormData } from '../types';

export const useTicketsForm = (defaultValues?: TicketsFormData) => {
  const form = useForm<TicketsFormData>({
    mode: 'onBlur',
    defaultValues: defaultValues || {
      firstName: '',
      lastName: '',
    },
    resolver: zodResolver(ticketSchema as any),
  });

  return form;
};
